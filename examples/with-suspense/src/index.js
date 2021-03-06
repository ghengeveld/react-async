import React, { Suspense } from "react"
import { useAsync, IfFulfilled, IfRejected } from "react-async"
import ReactDOM from "react-dom"
import DevTools from "react-async-devtools"
import "./index.css"

const loadUser = ({ userId }) =>
  fetch(`https://reqres.in/api/users/${userId}`)
    .then(res => (res.ok ? res : Promise.reject(res)))
    .then(res => res.json())
    .then(({ data }) => data)

const UserPlaceholder = () => (
  <div className="user placeholder">
    <div className="avatar" />
    <div className="name">══════</div>
  </div>
)

const UserDetails = ({ data }) => (
  <div className="user">
    <img className="avatar" src={data.avatar} alt="" />
    <div className="name">
      {data.first_name} {data.last_name}
    </div>
  </div>
)

const User = ({ userId }) => {
  const state = useAsync({
    suspense: true,
    promiseFn: loadUser,
    debugLabel: `User ${userId}`,
    userId,
  })
  return (
    <>
      <IfFulfilled state={state}>{data => <UserDetails data={data} />}</IfFulfilled>
      <IfRejected state={state}>{error => <p>{error.message}</p>}</IfRejected>
    </>
  )
}

export const App = () => (
  <>
    <DevTools />
    <Suspense
      fallback={
        <>
          <UserPlaceholder />
          <UserPlaceholder />
        </>
      }
    >
      <User userId={1} />
      <User userId={2} />
    </Suspense>
  </>
)

if (process.env.NODE_ENV !== "test") ReactDOM.render(<App />, document.getElementById("root"))
