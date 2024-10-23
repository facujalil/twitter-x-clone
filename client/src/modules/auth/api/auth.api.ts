export const signUp = async (
  email: string,
  displayName: string,
  username: string,
  password: string
) => {
  const res = await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/auth/sign-up",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        displayName: displayName,
        username: username,
        password: password,
      }),
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await res.json();
  return data;
};

export const login = async (username: string, password: string) => {
  const res = await fetch(
    "https://twitter-x-clone-production.up.railway.app/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong.");
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  return data;
};
