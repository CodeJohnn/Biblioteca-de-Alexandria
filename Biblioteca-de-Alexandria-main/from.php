<?php
// Dados do projeto organizados em um array nativo do PHP
$projeto = [
    "titulo"      => "Biblioteca de Alexandria",
    "descricao"   => "Este é o meu centro de armazenamento pessoal.",
    "imagem"      => "assets/img/1.png",
    "link_codigo" => "https://github.com",
    "link_demo"   => "https://guedessec.com",
    "tecnologias" => [
        ["nome" => "HTML5", "classe" => "fa-brands fa-html5", "cor" => "#E34F26"],
        ["nome" => "CSS3", "classe" => "fa-brands fa-css3-alt", "cor" => "#1572B6"],
        ["nome" => "JavaScript", "classe" => "fa-brands fa-js", "cor" => "#F7DF1E"],
        ["nome" => "React", "classe" => "fa-brands fa-react", "cor" => "#61DAFB"]
    ]
];
?>

<!-- O HTML do seu Card renderizado pelo PHP -->
<div class="card active">
    <!-- Imagem -->
    <img src="<?php echo $projeto['imagem']; ?>" alt="<?php echo $projeto['titulo']; ?>">

    <!-- Título -->
    <h3><?php echo $projeto['titulo']; ?></h3>

    <!-- Descrição -->
    <p class="card-desc"><?php echo $projeto['descricao']; ?></p>

    <!-- Tecnologias (Looping para listar os ícones) -->
    <div class="project-tech">
        <?php foreach ($projeto['tecnologias'] as $tech): ?>
            <i class="<?php echo $tech['classe']; ?>" 
               style="color: <?php echo $tech['cor']; ?>;" 
               title="<?php echo $tech['nome']; ?>"></i>
        <?php endforeach; ?>
    </div>

    <!-- Botões que esticam lado a lado -->
    <div class="project-links">
        <a href="<?php echo $projeto['link_codigo']; ?>" target="_blank" rel="noopener noreferrer" class="btn-code">
            Código
        </a>
        <a href="<?php echo $projeto['link_demo']; ?>" target="_blank" rel="noopener noreferrer" class="btn-project">
            Ver Projeto
        </a>
    </div>
</div>