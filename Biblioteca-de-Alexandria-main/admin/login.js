document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#login-form");
  const button = document.querySelector("#login-button");
  const message = document.querySelector("#login-message");

  let client;
  try {
    client = window.createAlexandriaClient();
  } catch (error) {
    message.textContent = error.message;
    message.classList.add("error");
    button.disabled = true;
    return;
  }

  // Se já houver uma sessão, tenta abrir o painel.
  client.auth.getSession().then(({ data }) => {
    if (data.session) window.location.replace("dashboard.html");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "";
    message.className = "message";
    button.disabled = true;
    button.textContent = "Verificando...";

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;

    const { error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      message.textContent = "Não foi possível entrar. Confira suas credenciais e se a conta foi autorizada como administradora.";
      message.classList.add("error");
      button.disabled = false;
      button.textContent = "Entrar no painel";
      return;
    }

    // A proteção real é feita pelas políticas RLS no banco, não por esta página.
    window.location.replace("dashboard.html");
  });
});
