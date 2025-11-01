// Coleta todos os dados da ficha do localStorage
export function exportSheetToJSON(): string {
  const data: Record<string, any> = {};

  // Campos do cabeçalho
  data.name = localStorage.getItem("name") || "";
  data.player = localStorage.getItem("player") || "";
  data.race = localStorage.getItem("race") || "";
  data.classes = localStorage.getItem("classes") || "";
  data.level = Number(localStorage.getItem("level") || 1);
  data.concept = localStorage.getItem("concept") || "";

  // Perfil e arma
  data.profileImage = localStorage.getItem("profileImage") || "";
  data.weaponImage = localStorage.getItem("weaponImage") || "";
  data.weaponName = localStorage.getItem("weaponName") || "";

  // Atributos
  const attrsStr = localStorage.getItem("attrs");
  data.attrs = attrsStr ? JSON.parse(attrsStr) : {};

  // PV/PM
  data.pvMax = Number(localStorage.getItem("pvMax") || 10);
  data.pv = Number(localStorage.getItem("pv") || 10);
  data.pmMax = Number(localStorage.getItem("pmMax") || 10);
  data.pm = Number(localStorage.getItem("pm") || 10);
  data.damageReduction = Number(localStorage.getItem("damageReduction") || 0);

  // Defesa
  data.defense = {
    armor: Number(localStorage.getItem("def_armor") || 0),
    shield: Number(localStorage.getItem("def_shield") || 0),
    others: Number(localStorage.getItem("def_others") || 0),
    penalty: Number(localStorage.getItem("def_penalty") || 0),
  };

  // Ataques
  const attacksStr = localStorage.getItem("attacks");
  data.attacks = attacksStr ? JSON.parse(attacksStr) : [];

  // Perícias
  const skillsStr = localStorage.getItem("skills");
  data.skills = skillsStr ? JSON.parse(skillsStr) : [];

  // Equipamentos
  const equipmentStr = localStorage.getItem("equipment");
  data.equipment = equipmentStr ? JSON.parse(equipmentStr) : [];

  // Proficiências
  data.proficiencies = localStorage.getItem("proficiencies") || "";

  // Habilidades de Armas
  data.weaponAbilities = localStorage.getItem("weaponAbilities") || "";

  // Outros
  data.xp = Number(localStorage.getItem("xp") || 0);
  data.size = localStorage.getItem("size") || "Médio";
  data.speed = Number(localStorage.getItem("speed") || 9);

  // Metadados
  data.exportDate = new Date().toISOString();
  data.version = "1.0";

  return JSON.stringify(data, null, 2);
}

// Faz download do JSON
export function downloadJSON(): void {
  const json = exportSheetToJSON();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ficha-tormenta20-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Importa dados de um arquivo JSON
export function importSheetFromJSON(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);

    // Campos do cabeçalho
    if (data.name !== undefined) localStorage.setItem("name", String(data.name));
    if (data.player !== undefined) localStorage.setItem("player", String(data.player));
    if (data.race !== undefined) localStorage.setItem("race", String(data.race));
    if (data.classes !== undefined) localStorage.setItem("classes", String(data.classes));
    if (data.level !== undefined) localStorage.setItem("level", String(data.level));
    if (data.concept !== undefined) localStorage.setItem("concept", String(data.concept));

    // Perfil e arma
    if (data.profileImage !== undefined) localStorage.setItem("profileImage", String(data.profileImage));
    if (data.weaponImage !== undefined) localStorage.setItem("weaponImage", String(data.weaponImage));
    if (data.weaponName !== undefined) localStorage.setItem("weaponName", String(data.weaponName));

    // Atributos
    if (data.attrs !== undefined) localStorage.setItem("attrs", JSON.stringify(data.attrs));

    // PV/PM
    if (data.pvMax !== undefined) localStorage.setItem("pvMax", String(data.pvMax));
    if (data.pv !== undefined) localStorage.setItem("pv", String(data.pv));
    if (data.pmMax !== undefined) localStorage.setItem("pmMax", String(data.pmMax));
    if (data.pm !== undefined) localStorage.setItem("pm", String(data.pm));
    if (data.damageReduction !== undefined) localStorage.setItem("damageReduction", String(data.damageReduction));

    // Defesa
    if (data.defense) {
      if (data.defense.armor !== undefined) localStorage.setItem("def_armor", String(data.defense.armor));
      if (data.defense.shield !== undefined) localStorage.setItem("def_shield", String(data.defense.shield));
      if (data.defense.others !== undefined) localStorage.setItem("def_others", String(data.defense.others));
      if (data.defense.penalty !== undefined) localStorage.setItem("def_penalty", String(data.defense.penalty));
    }

    // Ataques
    if (data.attacks !== undefined) localStorage.setItem("attacks", JSON.stringify(data.attacks));

    // Perícias
    if (data.skills !== undefined) localStorage.setItem("skills", JSON.stringify(data.skills));

    // Equipamentos
    if (data.equipment !== undefined) localStorage.setItem("equipment", JSON.stringify(data.equipment));

    // Proficiências
    if (data.proficiencies !== undefined) localStorage.setItem("proficiencies", String(data.proficiencies));

    // Habilidades de Armas
    if (data.weaponAbilities !== undefined) localStorage.setItem("weaponAbilities", String(data.weaponAbilities));

    // Outros
    if (data.xp !== undefined) localStorage.setItem("xp", String(data.xp));
    if (data.size !== undefined) localStorage.setItem("size", String(data.size));
    if (data.speed !== undefined) localStorage.setItem("speed", String(data.speed));

    return true;
  } catch (error) {
    console.error("Erro ao importar JSON:", error);
    return false;
  }
}

