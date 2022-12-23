---
title: 'Bluetoothを用いてデータをMongoDBへロギングするCLIツールを作りました'
description: 'BLEを使ったロギングCLIツールを作った話'
date: '2022-12-23T16:00:00.284Z'
contentType: 'blog'
tags: ['ble', 'mongodb', 'cli-tool', 'logger']
thumbnailAlt: 'BLEを使ったロギングCLIツールを作った話'
draft: false
---

この記事は[TDU CPSLab Advent Calendar 2022 - Adventar](https://adventar.org/calendars/7417)の10日目の記事です

前の記事は[こちら]()から。次の記事は[こちら]()から。


# はじめに

こんにちは。都内で大学生をやっているなるせいです。

今回はBluetoothを用いてデータをMongoDBへロギングするCLIツールを作りましたので、記事にまとめておこうと思います。  
リポジトリは[こちら](https://github.com/narusei/blegger)です。

# 目次

* 開発環境
* どんなことができるの？
* 実装内容
  * Bluetoothデバイスの取得
  * MongoDBにアクセスする実装
  * CLIツールの実装
* 確認できていないこと
* おわりに

# 開発環境

開発にはNode.jsにTypescriptを導入して作りました。  
使用したモジュールは以下の通りです。

* @abandonware/noble
  * Node.js内にてBluetoothを扱うためのモジュールです
* mongodb
  * MongoDBサーバにアクセスするために使います
* yargs
  * CLIツール化するために使うモジュールです

加えてMongoDBサーバをDockerを用いて立てています

# どんなことができるの？
Bluetoothを扱えるマイコンにてnotifyされた際の情報を受信してMongoDBの方に格納します。  
データはStringで送信します。複数送信したい場合は以下のように送信します。
```
data = data1 + "," + data2 + "," + data3
```

デバイス側の準備が整ったらCLIを起動します。  
CLIの扱い方は以下の通りです。


* ターミナルで本リポジトリ配下を開いてください
  * `/blegger`に。以下ターミナル 1 と呼称します
* ターミナルで本リポジトリ配下の mongo フォルダを開いてください
  * `/blegger/mongo`に。以下ターミナル 2 と呼称します
* ターミナル 1 で`npm install`します
* ターミナル 2 で`docker compose up`します
  * 古いバージョンを使っている方は`docker-compose up`
* ターミナル 1 で以下のフォーマットに従い実行します
  * `npm start -- --name="YOUR_DEVICE_LOCAL_NAME" --service="YOUR_SERVICE_UUID" --characteristics="YOUR_CHARACTERISTIC_UUID1" "YOUR_CHARACTERISTIC_UUID2" --columns="DATABASE_COLUMN1" "DATABASE_COLUMN2"`

オプションは以下のようになっています。  
`npm start -- --help`で見ることができるヘルプと同じ内容です。

- name オプション
  - name オプションは作成した BLE デバイスのローカルネームを指します。デバイスの識別に使っています。
  - 必須オプションです。String です。
- service オプション
  - service オプションはサービスの UUID を指定します。
  - 必須オプションです。String です。
- characteristics オプション
  - characteristics はキャラクタリスティックの UUID を指定します。
  - 必須オプションです。Array\<String\>です。配列で指定できます。columns オプションと指定した数が一致していなければなりません。
- columns オプション
  - columns オプションはデータベースに保存する際のコレクション名です。ひとつのキャラクタリスティックにつき、ひとつのコレクションの生成をイメージしています。
  - 必須オプションです。Array\<String\>です。配列で指定できます。characteristics オプションと指定した数が一致していなければなりません。

正常に動作した場合は mongoDB Compassなどからデータを確認できるはずです

# 実装内容
本章では各実装の簡単な説明をしていきます。  
全体のコードは[リポジトリ](https://github.com/narusei/blegger)をご覧ください。

## Bluetoothデバイスの取得
まずBluetoothを用いてNotifyしているデバイスを探します。  

```
noble.on('stateChange', async (state) => {
  if (state === 'poweredOn') {
    await noble.startScanningAsync()
  } else {
    await noble.stopScanningAsync()
  }
})
```

Scanを開始するには`startScanningAsync()`を用いればいいんですが、  
その前にnobleが実装しているstateがpowerOnになっているかをチェックする必要があります。

`noble.on('stateChange', callback(state))`を用いることによって、  
stateが変化した際にcallbackされる形になります。

この時のstateがpowerOnだった場合にScanを開始しています。

ちなみに`startScanning()`もありますがasync/awaitで書きたかったのでAsyncの方を使っています。


次にdeviceを取得する処理を行います。
```
noble.on('discover', async (peripheral: noble.Peripheral) => {
  console.log(`${peripheral.advertisement.localName}`)
  if (peripheral.advertisement.localName == localName) {
    console.log('Find ' + peripheral.advertisement.localName + '!')
  }
})
```
通常は上記のような形でdiscoverというイベントを監視して、ヒットしていったdeviceのローカルネームを見比べて該当するdeviceを引っ掛けるといった形になります。しかし私としてはこの中にドンドコ処理を書いていくのはあまり良くないかなと感じたので、Promiseで包んで非同期処理で取り出せるようにしました。

```
const discoveryHandler = new Promise<noble.Peripheral | undefined>((resolve, _reject) => {
  console.log('Start Scanning...')
  noble.on('discover', async (peripheral: noble.Peripheral) => {
    console.log(`${peripheral.advertisement.localName}`)
    if (peripheral.advertisement.localName == localName) {
      console.log('Find ' + peripheral.advertisement.localName + '!')
      resolve(peripheral)
    }
  })
})
```

この関数をawaitしてnoble.Peripheralを取得するイメージになります。

ただ一方で、見つからないときには恐らく永遠と探し続けるのではないかと思いました。そこでtimeoutを定義する関数を作成して、Promise.raceを用いてどっちかが解決するのを待つという形を取ることにしました。

```
const timeoutHandler = new Promise<noble.Peripheral | undefined>((resolve, _reject) => {
  setTimeout(() => {
    resolve(undefined)
  }, 30000)
})
```

```
const device = await Promise.race([discoveryHandler, timeoutHandler])
```

deviceが見つかったらListenerを全て削除します

```
noble.removeAllListeners()
```

以上の実装を組み合わせたdeviceを取得する関数が以下の通りになります。
```
const waitDevice = async (localName: string) => {
  console.log('Start Scan & Get Target Device')
  noble.on('stateChange', async (state) => {
    if (state === 'poweredOn') {
      await noble.startScanningAsync()
    } else {
      await noble.stopScanningAsync()
    }
  })

  const discoveryHandler = new Promise<noble.Peripheral | undefined>((resolve, _reject) => {
    console.log('Start Scanning...')
    noble.on('discover', async (peripheral: noble.Peripheral) => {
      console.log(`${peripheral.advertisement.localName}`)
      if (peripheral.advertisement.localName == localName) {
        console.log('Find ' + peripheral.advertisement.localName + '!')
        resolve(peripheral)
      }
    })
  })

  const timeoutHandler = new Promise<noble.Peripheral | undefined>((resolve, _reject) => {
    setTimeout(() => {
      resolve(undefined)
    }, 30000)
  })

  try {
    const device = await Promise.race([discoveryHandler, timeoutHandler])

    noble.removeAllListeners()

    if (device) {
      return device
    } else {
      throw new Error('Device not Found')
    }
  } catch (e) {
    throw new Error('Timeout')
  }
}
```

## MongoDBにアクセスする実装
次にmongoDBにアクセスする関数を用意します。

```
const connectMongo = async () => {
  try {
    await client.connect()
    await client.db('admin').command({ ping: 1 })
    console.log('Connected successfully to server')
  } catch (error) {
    console.log(error)
  }
}

const postMongo = async (colName: string, data: mongoDB.Document) => {
  try {
    const dbSensing = await client.db('sensing')
    const colSensing = dbSensing.collection(colName)
    const result = await colSensing.insertOne(data)
    return result
  } catch (error) {
    console.log(error)
  }
}
```

## CLIツールの実装
ここまで実装を終えたら準備は整いました。  
あとはyargsを使ってCLIツール化していきます。

まずcliで受け入れるコマンドの定義をしていきます。  
前節で述べたオプションを指定していきます。

```
const argv = await yargs
    .option('name', {
      alias: 'nm',
      description: 'ロギングを行うデバイスのLocalNameを指定してください',
      demandOption: true,
      type: 'string',
    })
    .option('service', {
      alias: 'ser',
      description: 'ロギングを行いたいServiceのUUIDを指定してください',
      demandOption: true,
      type: 'string',
    })
    .option('characteristics', {
      alias: 'char',
      description: 'ロギングを行いたいCharacteristicのUUIDを指定してください',
      demandOption: true,
      type: 'array',
    })
    .option('columns', {
      alias: 'col',
      description: 'データのコレクション名を書いてください',
      demandOption: true,
      type: 'array',
    })
    .help().argv
```

以上のような感じで受け入れオプションを設定します。  
以降、`argv.name`といった形でユーザが入力した値を取得することができます。

それでは入力値を変数に格納していきます。
```
const localName = argv.name ? argv.name : ''
const serviceUUIDs = argv.service ? [argv.service] : []
const characteristicUUIDs: string[] = argv.characteristics.map((value) => {
  return value.toString()
})
const columns: string[] = argv.columns.map((value) => {
  return value.toString()
})
```

また、characteristicの数はcolumnsの数と同じだけ存在する必要があります。  
columnsはDBに保管するときのデータの種類の数に対応しており、  
それぞれのcharactristicが各データに対応しているからです。

```
if (characteristicUUIDs.length != columns.length) {
  throw new Error('Characteristic and number of columns do not match')
}
```

入力されたlocalNameと先ほど定義したwaitDeviceを使ってデバイスを取ってきます
```
const device = await waitDevice(localName)
```

デバイスを取得できたらservice→characteristicと取得してsubscribeを行います。  
これでデバイスからデータを受信できるようになりました。

```
// deviceと接続
await device.connectAsync()

// serviceを取得
const service = (await device.discoverServicesAsync(serviceUUIDs))[0]

// characteristicsを取得
const characteristics = await service.discoverCharacteristicsAsync(characteristicUUIDs)

// subscribeを開始
Promise.all(
  characteristics.map((characteristic) => {
    characteristic.subscribeAsync()
  })
)
```

続いてmongoDBへの格納をしていきます。  
やり方は色々あると思いますが今回は以下のような実装をしました

```
const colchar = Object.fromEntries(columns.map((col, index) => [col, characteristics[index]]))

await connectMongo()

for (const col in colchar) {
  colchar[col].on('data', async (data) => {
    const receivedData = data.toString()
    console.log(receivedData)
    const postData = { ...receivedData.split(',') }
    await postMongo(col, postData)
  })
}
```

まずcharacteristicsの配列だったものをcolumnsをkeyとしたObjectに変換します。  
これでforループを回しながらcolumnsの値とcharacteristicsの値にアクセスすることができます。  
その後、mongoDBにアクセスしたのちにforループでデータを格納していきます。

最後にctl+Cで終了する前にデバイスやmongoDBとの接続を切る処理を挟み込んで終了です
```
process.on('SIGINT', async () => {
  await client.close()
  console.log('Mongo Client Close')
  device.disconnect()
  console.log('BLE Device Disconnected')
  process.exit(0)
})
```

各実装の紹介は以上です。  
全体のコードは[リポジトリ](https://github.com/narusei/blegger)をご覧ください。

# 確認できていないこと
本ツールは以下の点が確認できていないです

- どのくらいのレートで送信することができるのかの検証をしていないです
  - デバイス側で delay をかけないで送った場合にデータが欠落する恐れがあります
  - 100msくらいは取れました
- ロガー側のデータベース保存処理を逐次的に動作させているためパフォーマンス的に良くない可能性が高いです
  - バッファに貯めて一括保存などの処理を挟むべきだと考えています
- せっかく docker 使っているのに node.js 環境が必要な状態は改善したいなと感じています。

# おわりに

ケーブルをマイコンに繋げてシリアルモニタに表示されているものをコピペするという対応でも問題ないものはいいのですが、ケーブルレスでもっと色々な行動に対する加速度情報をロギングしたいといった需要があったため本CLIを作りました。もし同じような状況になった人とかいましたら是非ご活用くだされば嬉しいです。

