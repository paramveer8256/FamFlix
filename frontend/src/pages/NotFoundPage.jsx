import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-white"
      style={{ backgroundImage: `url(/404.png)` }}
    >
      <header className="absolute top-0 left-46 p-4 ng-black w-full">
        <Link to={"/"}>
          <img
            src="/famflix logo wobg.png"
            alt="Famflix"
            className="h-12 "
          />
        </Link>
      </header>
      <main className="text-center error-page--content z-10">
        <h1 className="text-7xl font-semibold mb-4">
          Lost your way?
        </h1>
        <p className="mb-6 text-xl">
          Sorry, we cant find that page. You'll find lots to
          explore on the home page.
        </p>
        <Link
          to={"/"}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          FAMFLIX Home
        </Link>
      </main>
    </div>
  );
};

export default NotFoundPage;
