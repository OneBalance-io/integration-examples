export const Login = ({ login }: { login: () => void }) => {
  return (
    <div className="flex justify-center">
      <div className="rounded-lg text-center border-surface-level-3 border py-8 px-5 bg-surface-level-2 inline-block">
        <h1 className="font-semibold text-3xl max-w-96 mx-auto">
          Welcome to OneBalance + Privy example app
        </h1>

        <hr className="max-w-32 mx-auto my-5 border-surface-level-3" />

        <button
          onClick={login}
          className="bg-brand-orange rounded-full text-black py-4 px-10 font-medium"
        >
          Please log in
        </button>
      </div>
    </div>
  );
};
