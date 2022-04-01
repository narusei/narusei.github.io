## Narusite

Gatsby.jsで構築した個人サイトです。
Github Pagesを使用して動いています。
サイトは[こちら](https://narusei.github.io/)から。

また、このサイトは雛形として[Gatsby-Starter-Blog](https://www.gatsbyjs.com/starters/gatsbyjs/gatsby-starter-blog)を利用させていただきました。

---

## 開発サーバ

```
yarn start
```

`gatsby develop`が動き開発サーバが起動します。

---

## 記事の書き方

記事は`content`フォルダ以下に書きます。
現状は以下のコンテンツが置かれています。

* works（制作物）
* blog（ブログ）
* about（自己紹介）

記事はマークダウンで書きます。その際の主要な構造としてFrontmatterと本文があります。

### Frontmatter

記事のメタ情報的な部分です。本サイトでは以下の構造で定義されています。

```
---
title: '個人サイトを作りました'
description: '個人サイトの作り方を紹介する記事'
date: '2015-05-01T22:12:03.284Z'
contentType: 'work'
tags: ['gatsby', 'tailwindcss']
thumbnail: './thumbnail_default.png'
thumbnailAlt: 'デフォルトのサムネイル画像'
link: 'https://narusei.github.io'
---
```

* title（required）
  * コンテンツのタイトルです。
* description（required）
  * コンテンツの内容の概要文章です。
* date（required）
  * 投稿日時です
* contentType（required）
  * そのコンテンツの種別です。現在は`work, blog, about`の3種類があります。
* tags
  * コンテンツのタグですが、現在タグ機能はないため見せかけになっています。
* thumbnail
  * コンテンツのサムネです。`work`コンテンツの場合でのみ使用しているため`blog`コンテンツでは指定する必要がありません。また`works`コンテンツであってもデフォルトのサムネが入るようになっているので指定がなくても動作します。
* thumbnailAlt
  * サムネイルの代替テキストです。
* link
  * 制作物のリンクです。


### 本文

Frontmatter直後にはマークダウン形式で本文を書くことができます。

---

## ブログを更新する

```
yarn deploy
```

gh-pagesを使用してデプロイが行われます。
