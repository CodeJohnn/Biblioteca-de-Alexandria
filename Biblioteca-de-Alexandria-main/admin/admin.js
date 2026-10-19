document.addEventListener("DOMContentLoaded", async () => {
  const $ = (selector) => document.querySelector(selector);
  const message = $("#global-message");
  let client;
  let links = [];
  let categories = [];

  try {
    client = window.createAlexandriaClient();
  } catch (error) {
    showMessage(error.message, "error");
    return;
  }

  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (sessionError || !sessionData.session) {
    window.location.replace("index.html");
    return;
  }

  // Confirma no banco se o usuário está na lista de administradores.
  const { data: adminAllowed, error: adminError } = await client.rpc("is_alexandria_admin");
  if (adminError || adminAllowed !== true) {
    await client.auth.signOut();
    alert("Esta conta não está autorizada como administradora.");
    window.location.replace("index.html");
    return;
  }

  $("#logout-button").addEventListener("click", async () => {
    await client.auth.signOut();
    window.location.replace("index.html");
  });

  $("#link-form").addEventListener("submit", saveLink);
  $("#cancel-edit-button").addEventListener("click", resetLinkForm);
  $("#category-form").addEventListener("submit", saveCategory);
  $("#cancel-category-edit").addEventListener("click", resetCategoryForm);
  $("#link-search").addEventListener("input", renderLinks);
  await loadAll();

  function showMessage(text, type = "") {
    message.textContent = text;
    message.className = `message global-message ${type}`.trim();
  }

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  async function loadAll() {
    showMessage("Carregando dados...");
    const [linkResult, categoryResult] = await Promise.all([
      client.from("alexandria_links")
        .select("id,title,url,description,image_url,category_id,created_at")
        .order("created_at", { ascending: false }),
      client.from("alexandria_categories")
        .select("id,name,description,created_at")
        .order("name", { ascending: true })
    ]);

    if (linkResult.error || categoryResult.error) {
      showMessage(
        `Erro ao carregar dados: ${(linkResult.error || categoryResult.error).message}`,
        "error"
      );
      return;
    }

    links = linkResult.data || [];
    categories = categoryResult.data || [];
    $("#links-count").textContent = links.length;
    $("#categories-count").textContent = categories.length;
    renderCategoryOptions();
    renderCategories();
    renderLinks();
    showMessage("Dados carregados.");
    setTimeout(() => { message.textContent = ""; }, 2500);
  }

  function renderCategoryOptions(selectedId = $("#link-category").value) {
    $("#link-category").innerHTML =
      '<option value="">Sem categoria</option>' +
      categories.map((category) =>
        `<option value="${category.id}" ${category.id === selectedId ? "selected" : ""}>${escapeHTML(category.name)}</option>`
      ).join("");
  }

  function renderLinks() {
    const query = $("#link-search").value.trim().toLowerCase();
    const filtered = links.filter((link) =>
      `${link.title} ${link.description || ""} ${link.url}`.toLowerCase().includes(query)
    );

    if (!filtered.length) {
      $("#links-list").innerHTML = '<p class="empty-state">Nenhum link encontrado. Cadastre o primeiro usando o formulário acima.</p>';
      return;
    }

    $("#links-list").innerHTML = filtered.map((link) => {
      const category = categories.find((item) => item.id === link.category_id);
      const image = link.image_url
        ? `<img class="item-thumb" src="${escapeHTML(link.image_url)}" alt="" loading="lazy">`
        : '<div class="item-thumb placeholder-thumb">↗</div>';

      return `
        <article class="item-row">
          ${image}
          <div class="item-details">
            <h3>${escapeHTML(link.title)}</h3>
            <p>${escapeHTML(category?.name || "Sem categoria")} · ${escapeHTML(link.description || "Sem descrição")}</p>
            <a href="${escapeHTML(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(link.url)}</a>
          </div>
          <div class="item-actions">
            <button class="button small secondary" type="button" data-edit-link="${link.id}">Editar</button>
            <button class="button small danger" type="button" data-delete-link="${link.id}">Excluir</button>
          </div>
        </article>`;
    }).join("");

    $("#links-list").querySelectorAll("[data-edit-link]").forEach((button) => {
      button.addEventListener("click", () => startEditLink(button.dataset.editLink));
    });
    $("#links-list").querySelectorAll("[data-delete-link]").forEach((button) => {
      button.addEventListener("click", () => deleteLink(button.dataset.deleteLink));
    });
  }

  async function saveLink(event) {
    event.preventDefault();
    const button = $("#save-link-button");
    button.disabled = true;
    showMessage("Salvando link...");

    try {
      const id = $("#link-id").value;
      const title = $("#link-title").value.trim();
      const url = $("#link-url").value.trim();
      const description = $("#link-description").value.trim();
      const categoryId = $("#link-category").value || null;
      let imageUrl = $("#link-image-url").value.trim() || null;
      const file = $("#link-image").files[0];

      if (!/^https?:\/\//i.test(url)) {
        throw new Error("Informe uma URL que comece com http:// ou https://.");
      }

      if (file) {
        if (file.size > 5 * 1024 * 1024) throw new Error("A imagem deve ter no máximo 5 MB.");
        if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) {
          throw new Error("Formato de imagem não permitido.");
        }
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, "-");
        const path = `${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await client.storage
          .from(window.ALEXANDRIA_STORAGE_BUCKET)
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;

        const { data: publicData } = client.storage
          .from(window.ALEXANDRIA_STORAGE_BUCKET)
          .getPublicUrl(path);
        imageUrl = publicData.publicUrl;
      }

      const record = {
        title,
        url,
        description: description || null,
        category_id: categoryId,
        image_url: imageUrl
      };

      const result = id
        ? await client.from("alexandria_links").update(record).eq("id", id)
        : await client.from("alexandria_links").insert(record);

      if (result.error) throw result.error;
      resetLinkForm();
      await loadAll();
      showMessage(id ? "Link atualizado com sucesso." : "Link cadastrado com sucesso.", "success");
    } catch (error) {
      showMessage(`Não foi possível salvar: ${error.message}`, "error");
    } finally {
      button.disabled = false;
    }
  }

  function startEditLink(id) {
    const link = links.find((item) => item.id === id);
    if (!link) return;
    $("#link-id").value = link.id;
    $("#link-title").value = link.title || "";
    $("#link-url").value = link.url || "";
    $("#link-description").value = link.description || "";
    $("#link-category").value = link.category_id || "";
    $("#link-image-url").value = link.image_url || "";
    $("#link-image").value = "";
    $("#link-form-title").textContent = "Editar link ou material";
    $("#save-link-button").textContent = "Salvar alterações";
    $("#cancel-edit-button").classList.remove("hidden");
    $("#links-section").scrollIntoView({ behavior: "smooth" });
  }

  function resetLinkForm() {
    $("#link-form").reset();
    $("#link-id").value = "";
    $("#link-form-title").textContent = "Adicionar link ou material";
    $("#save-link-button").textContent = "Salvar link";
    $("#cancel-edit-button").classList.add("hidden");
  }

  async function deleteLink(id) {
    const link = links.find((item) => item.id === id);
    if (!link || !confirm(`Excluir "${link.title}"? Esta ação não pode ser desfeita.`)) return;

    const { error } = await client.from("alexandria_links").delete().eq("id", id);
    if (error) {
      showMessage(`Não foi possível excluir: ${error.message}`, "error");
      return;
    }
    await loadAll();
    showMessage("Link excluído.", "success");
  }

  async function saveCategory(event) {
    event.preventDefault();
    const id = $("#category-id").value;
    const name = $("#category-name").value.trim();
    const description = $("#category-description").value.trim();
    if (!name) return;

    const record = { name, description: description || null };
    const result = id
      ? await client.from("alexandria_categories").update(record).eq("id", id)
      : await client.from("alexandria_categories").insert(record);

    if (result.error) {
      showMessage(`Não foi possível salvar a categoria: ${result.error.message}`, "error");
      return;
    }

    resetCategoryForm();
    await loadAll();
    showMessage(id ? "Categoria atualizada." : "Categoria criada com sucesso.", "success");
  }

  function startEditCategory(id) {
    const category = categories.find((item) => item.id === id);
    if (!category) return;
    $("#category-id").value = category.id;
    $("#category-name").value = category.name || "";
    $("#category-description").value = category.description || "";
    $("#save-category-button").textContent = "Salvar alterações";
    $("#cancel-category-edit").classList.remove("hidden");
    $("#categories-section").scrollIntoView({ behavior: "smooth" });
    $("#category-name").focus();
  }

  function resetCategoryForm() {
    $("#category-form").reset();
    $("#category-id").value = "";
    $("#save-category-button").textContent = "Criar categoria";
    $("#cancel-category-edit").classList.add("hidden");
  }

  function renderCategories() {
    if (!categories.length) {
      $("#categories-list").innerHTML = '<p class="empty-state">Nenhuma categoria cadastrada.</p>';
      return;
    }

    $("#categories-list").innerHTML = categories.map((category) => {
      const count = links.filter((link) => link.category_id === category.id).length;
      return `
        <article class="category-row">
          <div class="category-badge">▤</div>
          <div class="item-details">
            <h3>${escapeHTML(category.name)}</h3>
            <p>${escapeHTML(category.description || "Sem descrição")} · ${count} link(s)</p>
          </div>
          <div class="item-actions">
            <button class="button small secondary" type="button" data-edit-category="${category.id}">Editar</button>
            <button class="button small danger" type="button" data-delete-category="${category.id}">Excluir</button>
          </div>
        </article>`;
    }).join("");

    $("#categories-list").querySelectorAll("[data-edit-category]").forEach((button) => {
      button.addEventListener("click", () => startEditCategory(button.dataset.editCategory));
    });
    $("#categories-list").querySelectorAll("[data-delete-category]").forEach((button) => {
      button.addEventListener("click", () => deleteCategory(button.dataset.deleteCategory));
    });
  }

  async function deleteCategory(id) {
    const category = categories.find((item) => item.id === id);
    if (!category) return;
    if (links.some((link) => link.category_id === id)) {
      showMessage("Esta categoria ainda tem links. Mova esses links para outra categoria ou remova-os antes de excluir.", "error");
      return;
    }
    if (!confirm(`Excluir a categoria "${category.name}"?`)) return;

    const { error } = await client.from("alexandria_categories").delete().eq("id", id);
    if (error) {
      showMessage(`Não foi possível excluir: ${error.message}`, "error");
      return;
    }
    await loadAll();
    showMessage("Categoria excluída.", "success");
  }
});
