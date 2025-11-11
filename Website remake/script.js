document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const accordionContent = header.nextElementSibling;

    // Toggle active class for the header
    header.classList.toggle("active");

    // Expand or collapse the content
    if (accordionContent.classList.contains("open")) {
      accordionContent.classList.remove("open");
    } else {
      accordionContent.classList.add("open");
    }
  });
});

// Tab functionality
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs and contents
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((content) => content.classList.remove("active"));

    // Add active class to the clicked tab and corresponding content
    tab.classList.add("active");
    const target = document.querySelector(tab.dataset.target);
    target.classList.add("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const skills = [
    {
      name: "Coding",
      progress: 45,
      icon: "fa-solid fa-code",
      projects: [
        { name: "Enigma: RTC", link: "#enigma-rtc" },
        { name: "Infinity Arcade", link: "#infinity-arcade" },
      ],
      certifications: [
        { name: "CS50x Certification", link: "#cs50x-certification" },
        {
          name: "JavaScript Algorithms and Data Structures",
          link: "#javascript-algorithms",
        },
        { name: "Responsive Web Design", link: "#responsive-web-design" },
        {
          name: "Front End Development Libraries",
          link: "#front-end-libraries",
        },
        { name: "Data Visualization", link: "#data-visualization" },
      ],
    },
    {
      name: "Flask",
      progress: 35,
      icon: "devicon devicon-flask-original",
      projects: [{ name: "Infinity Arcade", link: "#infinity-arcade" }],
      certifications: [
        { name: "CS50x Certification", link: "#cs50x-certification" },
      ],
    },
    {
      name: "JavaScript",
      progress: 35,
      icon: "devicon devicon-javascript-plain",
      projects: [],
      certifications: [
        {
          name: "Front End Development Libraries",
          link: "#front-end-libraries",
        },
        { name: "Data Visualization", link: "#data-visualization" },
        {
          name: "JavaScript Algorithms and Data Structures",
          link: "#javascript-algorithms",
        },
      ],
    },
    {
      name: "HTML",
      progress: 85,
      icon: "devicon devicon-html5-plain",
      projects: [{ name: "Infinity Arcade", link: "#infinity-arcade" }],
      certifications: [
        { name: "Responsive Web Design", link: "#responsive-web-design" },
      ],
    },
    {
      name: "CSS",
      progress: 70,
      icon: "devicon devicon-css3-plain",
      projects: [],
      certifications: [
        { name: "Responsive Web Design", link: "#responsive-web-design" },
      ],
    },
    {
      name: "Python",
      progress: 70,
      icon: "devicon devicon-python-plain",
      projects: [{ name: "Infinity Arcade", link: "#infinity-arcade" }],
      certifications: [
        { name: "CS50x Certification", link: "#cs50x-certification" },
      ],
    },
    {
      name: "SQL",
      progress: 65,
      icon: "fa-solid fa-database",
      projects: [{ name: "Infinity Arcade", link: "#infinity-arcade" }],
      certifications: [
        { name: "CS50x Certification", link: "#cs50x-certification" },
      ],
    },
    {
      name: "C#",
      progress: 45,
      icon: "devicon devicon-csharp-plain",
      projects: [{ name: "Enigma: RTC", link: "#enigma-rtc" }],
      certifications: [],
    },
    {
      name: "3D Modelling",
      progress: 20,
      icon: "fa-solid fa-cube",
      projects: [
        { name: "Infinity Slope 1", link: "#infinity-slope-1" },
        { name: "iPhone 8", link: "#iphone-8" },
      ],
      certifications: [],
    },
    {
      name: "Blender",
      progress: 20,
      icon: "devicon devicon-blender-original",
      projects: [
        { name: "Infinity Slope 1", link: "#infinity-slope-1" },
        { name: "iPhone 8", link: "#iphone-8" },
      ],
      certifications: [],
    },
    {
      name: "React",
      progress: 30,
      icon: "devicon devicon-react-original",
      projects: [],
      certifications: [
        {
          name: "Front End Development Libraries",
          link: "#front-end-libraries",
        },
      ],
    },
    {
      name: "Data Analysis",
      progress: 10,
      icon: "fa-solid fa-chart-pie",
      projects: [],
      certifications: [
        { name: "Data Visualization", link: "#data-visualization" },
      ],
    },
    {
        name: "Lua",
        progress: 40,
        icon: "devicon devicon-lua-plain",
        projects: [{ name: "The Enigma", link: "#the-enigma" }],
        certifications: [
          
        ],
      },
    {
      name: "C",
      progress: 25,
      icon: "devicon devicon-c-plain",
      projects: [],
      certifications: [
        { name: "CS50x Certification", link: "#cs50x-certification" },
      ],
    },
    {
        name: "Django",
        progress: 10,
        icon: "devicon devicon-django-plain",
        projects: [],
        certifications: [
          { name: "CS50x Certification", link: "#cs50x-certification" },
        ],
      },
      {
        name: "D3.js",
        progress: 30,
        icon: "devicon devicon-d3js-plain",
        projects: [],
        certifications: [
          { name: "Data Visualization", link: "#data-visualization" },
        ],
      },
  ];

  const skillsGrid = document.querySelector(".skills-grid");

  // Sort skills by progress (highest to lowest)
  skills.sort((a, b) => b.progress - a.progress);

  // Clear the grid and repopulate it with sorted skills
  skillsGrid.innerHTML = ""; // Clear existing content
  skills.forEach((skill) => {
    const skillTile = document.createElement("div");
    skillTile.classList.add("skill-tile");
    skillTile.dataset.skill = skill.name.toLowerCase();

    // Determine the color based on the progress percentage
    let progressColor;
    if (skill.progress <= 10) {
      progressColor = "#ff1a1a"; // Red for under 10%
    } else if (skill.progress > 10 && skill.progress < 70) {
      progressColor = "#ffc107"; // Yellow for 10-75%
    } else {
      progressColor = "#28a745"; // Green for 75-100%
    }

    skillTile.innerHTML = `
    <div class="skill-icons">
        <i class="${skill.icon}"></i>
      </div>  
    <label>${skill.name}</label>
      <div class="progress-bar">
        <div class="progress" style="width: ${skill.progress}%; background-color: ${progressColor};"></div>
      </div>
      <div class="skill-content"></div>
    `;

    skillsGrid.appendChild(skillTile);
  });

  // Add click event listeners to each skill tile
  skillsGrid.addEventListener("click", (event) => {
    const skillTile = event.target.closest(".skill-tile");
    if (!skillTile) return;

    const skillName = skillTile.dataset.skill;
    const skillContent = skillTile.querySelector(".skill-content");

    // Toggle visibility of the skill content
    if (skillTile.classList.contains("expanded")) {
      skillTile.classList.remove("expanded");
      skillContent.classList.remove("expanded");
      skillContent.innerHTML = ""; // Clear content when collapsed
    } else {
      // Collapse all other expanded skill tiles
      document.querySelectorAll(".skill-tile.expanded").forEach((tile) => {
        tile.classList.remove("expanded");
        tile.querySelector(".skill-content").classList.remove("expanded");
        tile.querySelector(".skill-content").innerHTML = ""; // Clear content
      });

      skillTile.classList.add("expanded");
      skillContent.classList.add("expanded");

      // Find the skill data
      const skillData = skills.find(
        (skill) => skill.name.toLowerCase() === skillName
      );

      // Populate the content with related projects and certifications
      skillContent.innerHTML = `
        <h4>Projects</h4>
        <ul>
          ${
            skillData.projects.length > 0
              ? skillData.projects
                  .map(
                    (project) =>
                      `<li><a href="${project.link}">${project.name}</a></li>`
                  )
                  .join("")
              : "<li>No projects available</li>"
          }
        </ul>
        <h4>Certifications</h4>
        <ul>
          ${
            skillData.certifications.length > 0
              ? skillData.certifications
                  .map(
                    (cert) => `<li><a href="${cert.link}">${cert.name}</a></li>`
                  )
                  .join("")
              : "<li>No certifications available</li>"
          }
        </ul>
      `;
    }
  });

  const email = "bradleyjoe007@gmail.com";
  const phone = "+447587956344";

  document.getElementById("copy-email").addEventListener("click", () => {
    navigator.clipboard.writeText(email).then(() => {
      alert("Email copied to clipboard!");
    });
  });

  document.getElementById("copy-phone").addEventListener("click", () => {
    navigator.clipboard.writeText(phone).then(() => {
      alert("Phone number copied to clipboard!");
    });
  });
});

let lastScrollPosition = 0; // Track the last scroll position
const navbar = document.querySelector("nav"); // Select the navigation bar

window.addEventListener("scroll", () => {
  const currentScrollPosition = window.pageYOffset;

  if (currentScrollPosition > lastScrollPosition) {
    // Scrolling down - hide the navbar
    navbar.style.top = "-100px"; // Move navbar out of view
  } else {
    // Scrolling up - show the navbar
    navbar.style.top = "0"; // Reset navbar position
  }

  lastScrollPosition = currentScrollPosition; // Update the last scroll position
});
