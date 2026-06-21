import '@/app/globals.css'

export default async function HomePage() {
  // const headers = await getHeaders()
  // const payloadConfig = await config
  // const payload = await getPayload({ config: payloadConfig })
  // const { user } = await payload.auth({ headers })

  // const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col">
          <div>Login as :</div>
          <div className="flex flex-col">
            <a href="/superadmin" className="hover:underline">
              SuperAdmin
            </a>
            <a href="/admin-dashboard" className="hover:underline">
              Admin
            </a>
            <a href="/dashboard" className="hover:underline">
              User
            </a>
          </div>
        </div>
        <div className="px-5 py-2 bg-yellow-500/50 rounded-2xl mt-10">
          commit : leaderboard, google auth, photo profile update, content management, etc
        </div>
      </div>
      {/* <div className="home">
      <div className="content">
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/3.x/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/3.x/packages/ui/src/assets/payload-favicon.svg"
            width={65}
            />
        </picture>
        {!user && <h1>Welcome to your new project.</h1>}
        {user && <h1>Welcome back, {user.email}</h1>}
        <div className="links">
          <a
            className="admin"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel
          </a>
          <a
            className="docs"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </div>
      </div>
      <div className="footer">
        <p>Update this page by editing</p>
        <a className="codeLink" href={fileURL}>
          <code>app/(frontend)/page.tsx</code>
        </a>
      </div>
    </div> */}
    </>
  )
}
