import NextAuth from "next-auth"
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
// import EmailProvider from "next-auth/providers/email"

// credentials の情報から、ログイン可能か判定してユーザー情報を返す関数
const findUserByCredentials = (credentials: any) => {
  // 今回は簡易的な例なのでメールアドレスとパスワードが一致する場合にユーザー情報を返却する。
  // データベースでユーザーを管理している場合は、データベースからユーザーを取得して、パスワードハッシュを比較して判定するのがよいかと。
  if (
    credentials.email === process.env.USER_EMAIL &&
    credentials.password === process.env.USER_PASSWORD
  ) {
    // ログイン可ならユーザー情報を返却
    return { id: 1, name: "kuro" }
  } else {
    // ログイン不可の場合は null を返却
    return null
  }
}


// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers
  providers: [
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
    CredentialsProvider({
      // サインイン フォームに表示する名前 (例: 「Sign in with...」)
      name: 'Credentials',
      // 認証情報は、サインインページに適切なフォームを生成するために使用されます。
      // 送信されることを期待するフィールドを何でも指定することができます。
      // 例: ドメイン、ユーザー名、パスワード、2FAトークン、など。
      // オブジェクトを通して、任意の HTML 属性を <input> タグに渡すことができます。
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // ここでは、送信されたクレデンシャルを受け取る独自のロジックを記述。
        // 例）return { id: 1, name: 'J Smith', email: 'jsmith@example.com' } を返します。
        // また、`req` オブジェクトを使用して、追加のパラメータを取得することができます。
        // (例: リクエストの IP アドレス) を取得することもできます。
        // const res = await fetch("/your/endpoint", {
        //   method: 'POST',
        //   body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" }
        // })
        // const user = await res.json()

        // if (res.ok && user) {
        //   return user
        // }
        const user = findUserByCredentials(credentials)
        if (user) {
          // 返されたオブジェクトはすべてJWTの`user`プロパティに保存される
          return user
        }
        // ユーザーデータを取得できなかった場合は null を返す。
        return null
      }
    })
  ],

  session: {
    // データベースセッションの代わりに、JSONウェブトークンをセッションに使用します。
    // このオプションは、ユーザー/アカウント用のデータベースの有無にかかわらず使用することができます。
    // 注意: データベースを使用しない場合は、`strategy`を 'jwt' に設定する必要があります。
    strategy: 'jwt'

    // Seconds - セッションが期限切れで無効になるまでの時間。
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - データベースへの書き込み頻度を調整し、セッションを延長します。
    // 書き込み操作を制限するために使用します。0に設定すると、常にデータベースが更新されます。
    // 注：このオプションは、JSONウェブトークンを使用している場合、無視されます。
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web トークンは `strategy: 'jwt'` session オプションが設定されている場合のみ、セッションに使用されます。
  // オプションがセットされている場合、もしくはデータベースが指定されていない場合はデフォルトで使用されます。
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // 秘密鍵の生成に使用する（明示的に設定する必要があります。）
    // secret: process.env.SECRET,
    // 暗号化を使用する場合はtrueを設定する (default: false)
    // encryption: true,
    // 署名と暗号化のためのエンコード/デコード関数を独自に定義することができます。
    // デフォルトの挙動を上書きしたい場合は下記の通り
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // カスタムページを定義して、ビルトインのページをオーバーライドすることができます。これらは通常の Next.js pages
  // の '/api' フォルダの外側に置くようにしてください。 signIn: '/auth/mycustom-signin'
  // https://next-auth.js.org/configuration/pages
  pages: {
    // signIn: '/auth/signin',  // Displays signin buttons
    // signOut: '/', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // コールバックは、何が起こるかを制御するために使用できる非同期関数です。
  // アクションが実行されたとき。
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) { return true },
    // async redirect({ url, baseUrl }) { return baseUrl },
    async session({ session, token, user }) { return session },
    async jwt({ token, user, account, profile, isNewUser }) { return token }
  },

  // 問題が発生した場合、コンソールでデバッグメッセージを有効にする
  debug: true,
}

export default NextAuth(authOptions);
