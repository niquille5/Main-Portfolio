document.addEventListener("DOMContentLoaded", () => {
  const skillTree = document.getElementById("skillTree");
  const detailTitle = document.getElementById("skillDetailTitle");
  const detailText = document.getElementById("skillDetailText");
  const detailStatus = document.getElementById("skillDetailStatus");
  const detailProgress = document.getElementById("skillDetailProgress");
  const detailProgressText = document.getElementById("skillDetailProgressText");
  const detailCategory = document.getElementById("skillDetailCategory");
  const detailIcon = document.getElementById("skillDetailIcon");
  const detailPanel = document.querySelector(".skill-detail-panel");

  if (!skillTree) return;

  const getStatus = (progress) => {
    if (progress <= 20) return "Toekomst";
    if (progress <= 45) return "Aan het leren";
    if (progress <= 65) return "Basis behaald";
    return "Goed op weg";
  };

  const statusText = {
    Toekomst: "Toekomst / Locked",
    "Aan het leren": "Aan het leren",
    "Basis behaald": "Basis behaald",
    "Goed op weg": "Goed op weg",
  };

  const groups = {
    future: {
      title: "Future Goals",
      icon: "FG",
      color: "#94a3b8",
      className: "tree-future",
      skills: [
        ["React", "Component-based frontend applicaties bouwen.", 10],
        ["TypeScript", "JavaScript veiliger en schaalbaarder schrijven.", 5],
        ["Tailwind CSS", "Sneller consistente interfaces bouwen.", 10],
        ["Authentication", "Login en gebruikerssessies veilig opzetten.", 10],
        ["Deployment", "Projecten professioneel online zetten.", 10],
        ["API Security", "Endpoints beter beschermen tegen misbruik.", 5],
        ["Fullstack Projects", "Frontend, backend en database combineren.", 15],
      ],
    },
    roots: {
      title: "Roots / Basis",
      icon: "RT",
      color: "#38bdf8",
      className: "tree-roots",
      skills: [
        ["Problem Solving", "Problemen rustig opdelen en stap voor stap oplossen.", 55],
        ["Learning by Doing", "Leren door te bouwen, testen en verbeteren.", 60],
        ["Teamwork", "Samenwerken in projecten en community activiteiten.", 55],
        ["Discipline", "Doorzetten tijdens studie, werk en portfolio-opbouw.", 50],
        ["Research", "Informatie zoeken en toepassen in praktische oplossingen.", 45],
      ],
    },
    trunk: {
      title: "ICT Foundation / Stam",
      icon: "ICT",
      color: "#60a5fa",
      className: "tree-trunk",
      skills: [
        ["HTML", "Structuur bouwen voor duidelijke webpagina's.", 65],
        ["CSS", "Layouts, kleuren en visuele afwerking maken.", 60],
        ["JavaScript Basics", "Basislogica en interactie toevoegen aan websites.", 40],
        ["Logical Thinking", "Technische stappen logisch ordenen.", 50],
        ["Responsive Design", "Websites netjes laten werken op elk scherm.", 45],
      ],
    },
    branches: [
      {
        title: "Frontend Development",
        icon: "FE",
        color: "#22d3ee",
        side: "left",
        skills: [
          ["HTML Structure", "Semantische pagina's bouwen.", 65],
          ["CSS Styling", "Professionele styling en layout toepassen.", 60],
          ["JavaScript", "Interactie en dynamiek toevoegen.", 40],
          ["DOM Manipulation", "Elementen met JavaScript aanpassen.", 35],
          ["Animations", "Subtiele motion maken zonder afleiding.", 35],
          ["Responsive Design", "Layouts flexibel maken voor elk scherm.", 45],
        ],
      },
      {
        title: "Backend Development",
        icon: "BE",
        color: "#818cf8",
        side: "right",
        skills: [
          ["Node.js", "JavaScript gebruiken aan de serverkant.", 30],
          ["Express.js", "Routes en serverstructuur opzetten.", 30],
          ["REST API", "Data ophalen en versturen via endpoints.", 35],
          ["Routes", "Pagina's en endpoints logisch organiseren.", 40],
          ["Middleware", "Requests controleren voor ze verder gaan.", 25],
          ["JSON", "Data gestructureerd lezen en versturen.", 45],
        ],
      },
      {
        title: "Databases",
        icon: "DB",
        color: "#34d399",
        side: "left",
        skills: [
          ["MySQL", "Relationele databases gebruiken.", 40],
          ["SQL Queries", "Data selecteren, filteren en aanpassen.", 40],
          ["Primary Keys", "Records uniek identificeren.", 50],
          ["Foreign Keys", "Tabellen logisch verbinden.", 45],
          ["ERD", "Databases visueel plannen.", 40],
          ["Joins", "Data uit meerdere tabellen combineren.", 35],
          ["CRUD", "Create, read, update en delete toepassen.", 35],
        ],
      },
      {
        title: "Tools & Workflow",
        icon: "TW",
        color: "#f59e0b",
        side: "right",
        skills: [
          ["VS Code", "Mijn hoofdeditor voor webdevelopment.", 65],
          ["Git", "Versiebeheer gebruiken tijdens projecten.", 35],
          ["GitHub", "Projecten online beheren en delen.", 40],
          ["Branches", "Werk opdelen zonder main te breken.", 30],
          ["Pull Requests", "Code review professioneler maken.", 25],
          ["Postman", "API endpoints testen.", 30],
          ["MySQL Workbench", "Databases visueel beheren.", 40],
        ],
      },
      {
        title: "Hardware & IoT",
        icon: "IoT",
        color: "#fb7185",
        side: "left",
        skills: [
          ["ESP32", "Microcontroller gebruiken voor slimme projecten.", 35],
          ["Sensors", "Input meten vanuit de fysieke wereld.", 35],
          ["Arduino IDE", "Hardwarecode schrijven en uploaden.", 35],
          ["Serial Monitor", "Sensorwaarden controleren tijdens testen.", 45],
          ["LED Control", "Output aansturen met schakelingen.", 45],
          ["Prototyping", "Ideeen bouwen en snel testen.", 50],
          ["Testing", "Problemen vinden door herhaald te meten.", 40],
        ],
      },
      {
        title: "Design & UI",
        icon: "UI",
        color: "#a78bfa",
        side: "right",
        skills: [
          ["UI Design", "Schermen logisch en rustig opbouwen.", 40],
          ["Dark Mode", "Een sterke donkere visuele ervaring maken.", 45],
          ["Light Mode", "Een lichte en leesbare interface maken.", 45],
          ["Glassmorphism", "Moderne glass panels en diepte toepassen.", 35],
          ["User Experience", "Denken vanuit gebruiksgemak en flow.", 35],
          ["Website Animations", "Motion gebruiken zonder afleiding.", 35],
        ],
      },
    ],
  };

  const createNode = (group, skill) => {
    const [name, description, progress] = skill;
    const status = getStatus(progress);
    const node = document.createElement("button");
    const icon = status === "Toekomst" ? "LOCK" : group.icon;

    node.className = [
      "skill-node",
      status === "Toekomst" ? "is-locked" : "",
      status === "Aan het leren" ? "is-learning" : "",
      status === "Basis behaald" || status === "Goed op weg" ? "is-unlocked" : "",
    ].join(" ");

    node.type = "button";
    node.dataset.status = status;
    node.dataset.name = name;
    node.dataset.category = group.title;
    node.dataset.progress = String(progress);
    node.style.setProperty("--progress", `${progress}%`);
    node.style.setProperty("--progress-deg", `${progress * 3.6}deg`);
    node.style.setProperty("--category-color", group.color);
    node.setAttribute("aria-label", `${name}. ${statusText[status]}. ${progress}% progress. ${description}`);
    node.innerHTML = `
      <span class="skill-orb" aria-hidden="true">
        <span class="skill-ring"></span>
        <span class="skill-core">
          <span class="node-icon">${icon}</span>
          <strong class="node-name">${name}</strong>
          <span class="skill-percent">${progress}%</span>
        </span>
      </span>
      <span class="node-description">${description}</span>
      <span class="node-tooltip">${description}</span>
    `;

    node.addEventListener("click", () => {
      selectNode(node, {
        name,
        description,
        progress,
        status,
        category: group.title,
        color: group.color,
        icon: group.icon,
      });
    });

    return node;
  };

  const createSection = (group) => {
    const section = document.createElement("section");
    const path = document.createElement("div");

    section.className = `tree-section ${group.className}`;
    section.style.setProperty("--category-color", group.color);
    section.innerHTML = `<h2 class="tree-section-title"><span>${group.icon}</span>${group.title}</h2>`;

    path.className = "tree-path";
    group.skills.forEach((skill) => path.append(createNode(group, skill)));
    section.append(path);
    return section;
  };

  const createBranch = (branch) => {
    const section = document.createElement("section");
    const cluster = document.createElement("div");

    section.className = `tree-branch ${branch.side}`;
    section.style.setProperty("--category-color", branch.color);
    section.innerHTML = `<h2 class="tree-branch-title"><span>${branch.icon}</span>${branch.title}</h2>`;

    cluster.className = "node-cluster";
    branch.skills.forEach((skill) => cluster.append(createNode(branch, skill)));
    section.append(cluster);
    return section;
  };

  const selectNode = (node, skill) => {
    document.querySelectorAll(".skill-node.is-active").forEach((item) => item.classList.remove("is-active"));

    node.classList.add("is-active");
    detailPanel?.classList.remove("is-updating");
    void detailPanel?.offsetWidth;

    if (detailPanel) {
      detailPanel.style.setProperty("--detail-color", skill.color);
      detailPanel.style.setProperty("--detail-progress", `${skill.progress * 3.6}deg`);
      detailPanel.dataset.status = skill.status;
    }

    if (detailIcon) detailIcon.textContent = skill.icon;
    detailTitle.textContent = skill.name;
    detailText.textContent = skill.description;
    detailStatus.textContent = statusText[skill.status];
    detailProgress.textContent = `${skill.progress}%`;
    if (detailProgressText) detailProgressText.textContent = `${skill.progress}%`;
    detailCategory.textContent = skill.category;
    detailPanel?.classList.add("is-updating");

    window.setTimeout(() => {
      detailPanel?.classList.remove("is-updating");
    }, 520);
  };

  const renderTree = () => {
    const branchField = document.createElement("div");

    skillTree.append(createSection(groups.future));

    branchField.className = "branch-field";
    groups.branches.forEach((branch) => branchField.append(createBranch(branch)));
    skillTree.append(branchField);

    skillTree.append(createSection(groups.trunk));
    skillTree.append(createSection(groups.roots));
  };

  renderTree();

  document.querySelector(".skill-node:not(.is-locked)")?.click();
});
