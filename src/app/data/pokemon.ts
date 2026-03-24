export interface Pokemon {
  id: number;
  names: Record<string, string>;
  types: string[];
}

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "ja", label: "日本語" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/${id}.png`;
}

export const TYPE_COLORS: Record<string, string> = {
  Normal: "#A8A77A",
  Fire: "#EE8130",
  Water: "#6390F0",
  Electric: "#F7D02C",
  Grass: "#7AC74C",
  Ice: "#96D9D6",
  Fighting: "#C22E28",
  Poison: "#A33EA1",
  Ground: "#E2BF65",
  Flying: "#A98FF3",
  Psychic: "#F95587",
  Bug: "#A6B91A",
  Rock: "#B6A136",
  Ghost: "#735797",
  Dragon: "#6F35FC",
  Steel: "#B7B7CE",
  Fairy: "#D685AD",
  Dark: "#705746",
};

export const POKEMON: Pokemon[] = [
  {
    "id": 1,
    "names": {
      "en": "Bulbasaur",
      "fr": "Bulbizarre",
      "de": "Bisasam",
      "es": "Bulbasaur",
      "it": "Bulbasaur",
      "ja": "フシギダネ",
      "ko": "이상해씨"
    },
    "types": [
      "Grass",
      "Poison"
    ]
  },
  {
    "id": 2,
    "names": {
      "en": "Ivysaur",
      "fr": "Herbizarre",
      "de": "Bisaknosp",
      "es": "Ivysaur",
      "it": "Ivysaur",
      "ja": "フシギソウ",
      "ko": "이상해풀"
    },
    "types": [
      "Grass",
      "Poison"
    ]
  },
  {
    "id": 3,
    "names": {
      "en": "Venusaur",
      "fr": "Florizarre",
      "de": "Bisaflor",
      "es": "Venusaur",
      "it": "Venusaur",
      "ja": "フシギバナ",
      "ko": "이상해꽃"
    },
    "types": [
      "Grass",
      "Poison"
    ]
  },
  {
    "id": 4,
    "names": {
      "en": "Charmander",
      "fr": "Salamèche",
      "de": "Glumanda",
      "es": "Charmander",
      "it": "Charmander",
      "ja": "ヒトカゲ",
      "ko": "파이리"
    },
    "types": [
      "Fire"
    ]
  },
  {
    "id": 5,
    "names": {
      "en": "Charmeleon",
      "fr": "Reptincel",
      "de": "Glutexo",
      "es": "Charmeleon",
      "it": "Charmeleon",
      "ja": "リザード",
      "ko": "리자드"
    },
    "types": [
      "Fire"
    ]
  },
  {
    "id": 6,
    "names": {
      "en": "Charizard",
      "fr": "Dracaufeu",
      "de": "Glurak",
      "es": "Charizard",
      "it": "Charizard",
      "ja": "リザードン",
      "ko": "리자몽"
    },
    "types": [
      "Fire",
      "Flying"
    ]
  },
  {
    "id": 7,
    "names": {
      "en": "Squirtle",
      "fr": "Carapuce",
      "de": "Schiggy",
      "es": "Squirtle",
      "it": "Squirtle",
      "ja": "ゼニガメ",
      "ko": "꼬부기"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 8,
    "names": {
      "en": "Wartortle",
      "fr": "Carabaffe",
      "de": "Schillok",
      "es": "Wartortle",
      "it": "Wartortle",
      "ja": "カメール",
      "ko": "어니부기"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 9,
    "names": {
      "en": "Blastoise",
      "fr": "Tortank",
      "de": "Turtok",
      "es": "Blastoise",
      "it": "Blastoise",
      "ja": "カメックス",
      "ko": "거북왕"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 10,
    "names": {
      "en": "Caterpie",
      "fr": "Chenipan",
      "de": "Raupy",
      "es": "Caterpie",
      "it": "Caterpie",
      "ja": "キャタピー",
      "ko": "캐터피"
    },
    "types": [
      "Bug"
    ]
  },
  {
    "id": 11,
    "names": {
      "en": "Metapod",
      "fr": "Chrysacier",
      "de": "Safcon",
      "es": "Metapod",
      "it": "Metapod",
      "ja": "トランセル",
      "ko": "단데기"
    },
    "types": [
      "Bug"
    ]
  },
  {
    "id": 12,
    "names": {
      "en": "Butterfree",
      "fr": "Papilusion",
      "de": "Smettbo",
      "es": "Butterfree",
      "it": "Butterfree",
      "ja": "バタフリー",
      "ko": "버터플"
    },
    "types": [
      "Bug",
      "Flying"
    ]
  },
  {
    "id": 13,
    "names": {
      "en": "Weedle",
      "fr": "Aspicot",
      "de": "Hornliu",
      "es": "Weedle",
      "it": "Weedle",
      "ja": "ビードル",
      "ko": "뿔충이"
    },
    "types": [
      "Bug",
      "Poison"
    ]
  },
  {
    "id": 14,
    "names": {
      "en": "Kakuna",
      "fr": "Coconfort",
      "de": "Kokuna",
      "es": "Kakuna",
      "it": "Kakuna",
      "ja": "コクーン",
      "ko": "딱충이"
    },
    "types": [
      "Bug",
      "Poison"
    ]
  },
  {
    "id": 15,
    "names": {
      "en": "Beedrill",
      "fr": "Dardargnan",
      "de": "Bibor",
      "es": "Beedrill",
      "it": "Beedrill",
      "ja": "スピアー",
      "ko": "독침붕"
    },
    "types": [
      "Bug",
      "Poison"
    ]
  },
  {
    "id": 16,
    "names": {
      "en": "Pidgey",
      "fr": "Roucool",
      "de": "Taubsi",
      "es": "Pidgey",
      "it": "Pidgey",
      "ja": "ポッポ",
      "ko": "구구"
    },
    "types": [
      "Normal",
      "Flying"
    ]
  },
  {
    "id": 17,
    "names": {
      "en": "Pidgeotto",
      "fr": "Roucoups",
      "de": "Tauboga",
      "es": "Pidgeotto",
      "it": "Pidgeotto",
      "ja": "ピジョン",
      "ko": "피죤"
    },
    "types": [
      "Normal",
      "Flying"
    ]
  },
  {
    "id": 18,
    "names": {
      "en": "Pidgeot",
      "fr": "Roucarnage",
      "de": "Tauboss",
      "es": "Pidgeot",
      "it": "Pidgeot",
      "ja": "ピジョット",
      "ko": "피죤투"
    },
    "types": [
      "Normal",
      "Flying"
    ]
  },
  {
    "id": 19,
    "names": {
      "en": "Rattata",
      "fr": "Rattata",
      "de": "Rattfratz",
      "es": "Rattata",
      "it": "Rattata",
      "ja": "コラッタ",
      "ko": "꼬렛"
    },
    "types": [
      "Normal"
    ]
  },
  {
    "id": 20,
    "names": {
      "en": "Raticate",
      "fr": "Rattatac",
      "de": "Rattikarl",
      "es": "Raticate",
      "it": "Raticate",
      "ja": "ラッタ",
      "ko": "레트라"
    },
    "types": [
      "Normal"
    ]
  },
  {
    "id": 21,
    "names": {
      "en": "Spearow",
      "fr": "Piafabec",
      "de": "Habitak",
      "es": "Spearow",
      "it": "Spearow",
      "ja": "オニスズメ",
      "ko": "깨비참"
    },
    "types": [
      "Normal",
      "Flying"
    ]
  },
  {
    "id": 22,
    "names": {
      "en": "Fearow",
      "fr": "Rapasdepic",
      "de": "Ibitak",
      "es": "Fearow",
      "it": "Fearow",
      "ja": "オニドリル",
      "ko": "깨비드릴조"
    },
    "types": [
      "Normal",
      "Flying"
    ]
  },
  {
    "id": 23,
    "names": {
      "en": "Ekans",
      "fr": "Abo",
      "de": "Rettan",
      "es": "Ekans",
      "it": "Ekans",
      "ja": "アーボ",
      "ko": "아보"
    },
    "types": [
      "Poison"
    ]
  },
  {
    "id": 24,
    "names": {
      "en": "Arbok",
      "fr": "Arbok",
      "de": "Arbok",
      "es": "Arbok",
      "it": "Arbok",
      "ja": "アーボック",
      "ko": "아보크"
    },
    "types": [
      "Poison"
    ]
  },
  {
    "id": 25,
    "names": {
      "en": "Pikachu",
      "fr": "Pikachu",
      "de": "Pikachu",
      "es": "Pikachu",
      "it": "Pikachu",
      "ja": "ピカチュウ",
      "ko": "피카츄"
    },
    "types": [
      "Electric"
    ]
  },
  {
    "id": 26,
    "names": {
      "en": "Raichu",
      "fr": "Raichu",
      "de": "Raichu",
      "es": "Raichu",
      "it": "Raichu",
      "ja": "ライチュウ",
      "ko": "라이츄"
    },
    "types": [
      "Electric"
    ]
  },
  {
    "id": 27,
    "names": {
      "en": "Sandshrew",
      "fr": "Sabelette",
      "de": "Sandan",
      "es": "Sandshrew",
      "it": "Sandshrew",
      "ja": "サンド",
      "ko": "모래두지"
    },
    "types": [
      "Ground"
    ]
  },
  {
    "id": 28,
    "names": {
      "en": "Sandslash",
      "fr": "Sablaireau",
      "de": "Sandamer",
      "es": "Sandslash",
      "it": "Sandslash",
      "ja": "サンドパン",
      "ko": "고지"
    },
    "types": [
      "Ground"
    ]
  },
  {
    "id": 29,
    "names": {
      "en": "Nidoran♀",
      "fr": "Nidoran♀",
      "de": "Nidoran♀",
      "es": "Nidoran♀",
      "it": "Nidoran♀",
      "ja": "ニドラン♀",
      "ko": "니드런♀"
    },
    "types": [
      "Poison"
    ]
  },
  {
    "id": 30,
    "names": {
      "en": "Nidorina",
      "fr": "Nidorina",
      "de": "Nidorina",
      "es": "Nidorina",
      "it": "Nidorina",
      "ja": "ニドリーナ",
      "ko": "니드리나"
    },
    "types": [
      "Poison"
    ]
  },
  {
    "id": 31,
    "names": {
      "en": "Nidoqueen",
      "fr": "Nidoqueen",
      "de": "Nidoqueen",
      "es": "Nidoqueen",
      "it": "Nidoqueen",
      "ja": "ニドクイン",
      "ko": "니드퀸"
    },
    "types": [
      "Poison",
      "Ground"
    ]
  },
  {
    "id": 32,
    "names": {
      "en": "Nidoran♂",
      "fr": "Nidoran♂",
      "de": "Nidoran♂",
      "es": "Nidoran♂",
      "it": "Nidoran♂",
      "ja": "ニドラン♂",
      "ko": "니드런♂"
    },
    "types": [
      "Poison"
    ]
  },
  {
    "id": 33,
    "names": {
      "en": "Nidorino",
      "fr": "Nidorino",
      "de": "Nidorino",
      "es": "Nidorino",
      "it": "Nidorino",
      "ja": "ニドリーノ",
      "ko": "니드리노"
    },
    "types": [
      "Poison"
    ]
  },
  {
    "id": 34,
    "names": {
      "en": "Nidoking",
      "fr": "Nidoking",
      "de": "Nidoking",
      "es": "Nidoking",
      "it": "Nidoking",
      "ja": "ニドキング",
      "ko": "니드킹"
    },
    "types": [
      "Poison",
      "Ground"
    ]
  },
  {
    "id": 35,
    "names": {
      "en": "Clefairy",
      "fr": "Mélofée",
      "de": "Piepi",
      "es": "Clefairy",
      "it": "Clefairy",
      "ja": "ピッピ",
      "ko": "삐삐"
    },
    "types": [
      "Fairy"
    ]
  },
  {
    "id": 36,
    "names": {
      "en": "Clefable",
      "fr": "Mélodelfe",
      "de": "Pixi",
      "es": "Clefable",
      "it": "Clefable",
      "ja": "ピクシー",
      "ko": "픽시"
    },
    "types": [
      "Fairy"
    ]
  },
  {
    "id": 37,
    "names": {
      "en": "Vulpix",
      "fr": "Goupix",
      "de": "Vulpix",
      "es": "Vulpix",
      "it": "Vulpix",
      "ja": "ロコン",
      "ko": "식스테일"
    },
    "types": [
      "Fire"
    ]
  },
  {
    "id": 38,
    "names": {
      "en": "Ninetales",
      "fr": "Feunard",
      "de": "Vulnona",
      "es": "Ninetales",
      "it": "Ninetales",
      "ja": "キュウコン",
      "ko": "나인테일"
    },
    "types": [
      "Fire"
    ]
  },
  {
    "id": 39,
    "names": {
      "en": "Jigglypuff",
      "fr": "Rondoudou",
      "de": "Pummeluff",
      "es": "Jigglypuff",
      "it": "Jigglypuff",
      "ja": "プリン",
      "ko": "푸린"
    },
    "types": [
      "Normal",
      "Fairy"
    ]
  },
  {
    "id": 40,
    "names": {
      "en": "Wigglytuff",
      "fr": "Grodoudou",
      "de": "Knuddeluff",
      "es": "Wigglytuff",
      "it": "Wigglytuff",
      "ja": "プクリン",
      "ko": "푸크린"
    },
    "types": [
      "Normal",
      "Fairy"
    ]
  },
  {
    "id": 41,
    "names": {
      "en": "Zubat",
      "fr": "Nosferapti",
      "de": "Zubat",
      "es": "Zubat",
      "it": "Zubat",
      "ja": "ズバット",
      "ko": "주뱃"
    },
    "types": [
      "Poison",
      "Flying"
    ]
  },
  {
    "id": 42,
    "names": {
      "en": "Golbat",
      "fr": "Nosferalto",
      "de": "Golbat",
      "es": "Golbat",
      "it": "Golbat",
      "ja": "ゴルバット",
      "ko": "골뱃"
    },
    "types": [
      "Poison",
      "Flying"
    ]
  },
  {
    "id": 43,
    "names": {
      "en": "Oddish",
      "fr": "Mystherbe",
      "de": "Myrapla",
      "es": "Oddish",
      "it": "Oddish",
      "ja": "ナゾノクサ",
      "ko": "뚜벅쵸"
    },
    "types": [
      "Grass",
      "Poison"
    ]
  },
  {
    "id": 44,
    "names": {
      "en": "Gloom",
      "fr": "Ortide",
      "de": "Duflor",
      "es": "Gloom",
      "it": "Gloom",
      "ja": "クサイハナ",
      "ko": "냄새꼬"
    },
    "types": [
      "Grass",
      "Poison"
    ]
  },
  {
    "id": 45,
    "names": {
      "en": "Vileplume",
      "fr": "Rafflesia",
      "de": "Giflor",
      "es": "Vileplume",
      "it": "Vileplume",
      "ja": "ラフレシア",
      "ko": "라플레시아"
    },
    "types": [
      "Grass",
      "Poison"
    ]
  },
  {
    "id": 46,
    "names": {
      "en": "Paras",
      "fr": "Paras",
      "de": "Paras",
      "es": "Paras",
      "it": "Paras",
      "ja": "パラス",
      "ko": "파라스"
    },
    "types": [
      "Bug",
      "Grass"
    ]
  },
  {
    "id": 47,
    "names": {
      "en": "Parasect",
      "fr": "Parasect",
      "de": "Parasek",
      "es": "Parasect",
      "it": "Parasect",
      "ja": "パラセクト",
      "ko": "파라섹트"
    },
    "types": [
      "Bug",
      "Grass"
    ]
  },
  {
    "id": 48,
    "names": {
      "en": "Venonat",
      "fr": "Mimitoss",
      "de": "Bluzuk",
      "es": "Venonat",
      "it": "Venonat",
      "ja": "コンパン",
      "ko": "콘팡"
    },
    "types": [
      "Bug",
      "Poison"
    ]
  },
  {
    "id": 49,
    "names": {
      "en": "Venomoth",
      "fr": "Aéromite",
      "de": "Omot",
      "es": "Venomoth",
      "it": "Venomoth",
      "ja": "モルフォン",
      "ko": "도나리"
    },
    "types": [
      "Bug",
      "Poison"
    ]
  },
  {
    "id": 50,
    "names": {
      "en": "Diglett",
      "fr": "Taupiqueur",
      "de": "Digda",
      "es": "Diglett",
      "it": "Diglett",
      "ja": "ディグダ",
      "ko": "디그다"
    },
    "types": [
      "Ground"
    ]
  },
  {
    "id": 51,
    "names": {
      "en": "Dugtrio",
      "fr": "Triopikeur",
      "de": "Digdri",
      "es": "Dugtrio",
      "it": "Dugtrio",
      "ja": "ダグトリオ",
      "ko": "닥트리오"
    },
    "types": [
      "Ground"
    ]
  },
  {
    "id": 52,
    "names": {
      "en": "Meowth",
      "fr": "Miaouss",
      "de": "Mauzi",
      "es": "Meowth",
      "it": "Meowth",
      "ja": "ニャース",
      "ko": "나옹"
    },
    "types": [
      "Normal"
    ]
  },
  {
    "id": 53,
    "names": {
      "en": "Persian",
      "fr": "Persian",
      "de": "Snobilikat",
      "es": "Persian",
      "it": "Persian",
      "ja": "ペルシアン",
      "ko": "페르시온"
    },
    "types": [
      "Normal"
    ]
  },
  {
    "id": 54,
    "names": {
      "en": "Psyduck",
      "fr": "Psykokwak",
      "de": "Enton",
      "es": "Psyduck",
      "it": "Psyduck",
      "ja": "コダック",
      "ko": "고라파덕"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 55,
    "names": {
      "en": "Golduck",
      "fr": "Akwakwak",
      "de": "Entoron",
      "es": "Golduck",
      "it": "Golduck",
      "ja": "ゴルダック",
      "ko": "골덕"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 56,
    "names": {
      "en": "Mankey",
      "fr": "Férosinge",
      "de": "Menki",
      "es": "Mankey",
      "it": "Mankey",
      "ja": "マンキー",
      "ko": "망키"
    },
    "types": [
      "Fighting"
    ]
  },
  {
    "id": 57,
    "names": {
      "en": "Primeape",
      "fr": "Colossinge",
      "de": "Rasaff",
      "es": "Primeape",
      "it": "Primeape",
      "ja": "オコリザル",
      "ko": "성원숭"
    },
    "types": [
      "Fighting"
    ]
  },
  {
    "id": 58,
    "names": {
      "en": "Growlithe",
      "fr": "Caninos",
      "de": "Fukano",
      "es": "Growlithe",
      "it": "Growlithe",
      "ja": "ガーディ",
      "ko": "가디"
    },
    "types": [
      "Fire"
    ]
  },
  {
    "id": 59,
    "names": {
      "en": "Arcanine",
      "fr": "Arcanin",
      "de": "Arkani",
      "es": "Arcanine",
      "it": "Arcanine",
      "ja": "ウインディ",
      "ko": "윈디"
    },
    "types": [
      "Fire"
    ]
  },
  {
    "id": 60,
    "names": {
      "en": "Poliwag",
      "fr": "Ptitard",
      "de": "Quapsel",
      "es": "Poliwag",
      "it": "Poliwag",
      "ja": "ニョロモ",
      "ko": "발챙이"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 61,
    "names": {
      "en": "Poliwhirl",
      "fr": "Têtarte",
      "de": "Quaputzi",
      "es": "Poliwhirl",
      "it": "Poliwhirl",
      "ja": "ニョロゾ",
      "ko": "슈륙챙이"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 62,
    "names": {
      "en": "Poliwrath",
      "fr": "Tartard",
      "de": "Quappo",
      "es": "Poliwrath",
      "it": "Poliwrath",
      "ja": "ニョロボン",
      "ko": "강챙이"
    },
    "types": [
      "Water",
      "Fighting"
    ]
  },
  {
    "id": 63,
    "names": {
      "en": "Abra",
      "fr": "Abra",
      "de": "Abra",
      "es": "Abra",
      "it": "Abra",
      "ja": "ケーシィ",
      "ko": "캐이시"
    },
    "types": [
      "Psychic"
    ]
  },
  {
    "id": 64,
    "names": {
      "en": "Kadabra",
      "fr": "Kadabra",
      "de": "Kadabra",
      "es": "Kadabra",
      "it": "Kadabra",
      "ja": "ユンゲラー",
      "ko": "윤겔라"
    },
    "types": [
      "Psychic"
    ]
  },
  {
    "id": 65,
    "names": {
      "en": "Alakazam",
      "fr": "Alakazam",
      "de": "Simsala",
      "es": "Alakazam",
      "it": "Alakazam",
      "ja": "フーディン",
      "ko": "후딘"
    },
    "types": [
      "Psychic"
    ]
  },
  {
    "id": 66,
    "names": {
      "en": "Machop",
      "fr": "Machoc",
      "de": "Machollo",
      "es": "Machop",
      "it": "Machop",
      "ja": "ワンリキー",
      "ko": "알통몬"
    },
    "types": [
      "Fighting"
    ]
  },
  {
    "id": 67,
    "names": {
      "en": "Machoke",
      "fr": "Machopeur",
      "de": "Maschock",
      "es": "Machoke",
      "it": "Machoke",
      "ja": "ゴーリキー",
      "ko": "근육몬"
    },
    "types": [
      "Fighting"
    ]
  },
  {
    "id": 68,
    "names": {
      "en": "Machamp",
      "fr": "Mackogneur",
      "de": "Machomei",
      "es": "Machamp",
      "it": "Machamp",
      "ja": "カイリキー",
      "ko": "괴력몬"
    },
    "types": [
      "Fighting"
    ]
  },
  {
    "id": 69,
    "names": {
      "en": "Bellsprout",
      "fr": "Chétiflor",
      "de": "Knofensa",
      "es": "Bellsprout",
      "it": "Bellsprout",
      "ja": "マダツボミ",
      "ko": "모다피"
    },
    "types": [
      "Grass",
      "Poison"
    ]
  },
  {
    "id": 70,
    "names": {
      "en": "Weepinbell",
      "fr": "Boustiflor",
      "de": "Ultrigaria",
      "es": "Weepinbell",
      "it": "Weepinbell",
      "ja": "ウツドン",
      "ko": "우츠동"
    },
    "types": [
      "Grass",
      "Poison"
    ]
  },
  {
    "id": 71,
    "names": {
      "en": "Victreebel",
      "fr": "Empiflor",
      "de": "Sarzenia",
      "es": "Victreebel",
      "it": "Victreebel",
      "ja": "ウツボット",
      "ko": "우츠보트"
    },
    "types": [
      "Grass",
      "Poison"
    ]
  },
  {
    "id": 72,
    "names": {
      "en": "Tentacool",
      "fr": "Tentacool",
      "de": "Tentacha",
      "es": "Tentacool",
      "it": "Tentacool",
      "ja": "メノクラゲ",
      "ko": "왕눈해"
    },
    "types": [
      "Water",
      "Poison"
    ]
  },
  {
    "id": 73,
    "names": {
      "en": "Tentacruel",
      "fr": "Tentacruel",
      "de": "Tentoxa",
      "es": "Tentacruel",
      "it": "Tentacruel",
      "ja": "ドククラゲ",
      "ko": "독파리"
    },
    "types": [
      "Water",
      "Poison"
    ]
  },
  {
    "id": 74,
    "names": {
      "en": "Geodude",
      "fr": "Racaillou",
      "de": "Kleinstein",
      "es": "Geodude",
      "it": "Geodude",
      "ja": "イシツブテ",
      "ko": "꼬마돌"
    },
    "types": [
      "Rock",
      "Ground"
    ]
  },
  {
    "id": 75,
    "names": {
      "en": "Graveler",
      "fr": "Gravalanch",
      "de": "Georok",
      "es": "Graveler",
      "it": "Graveler",
      "ja": "ゴローン",
      "ko": "데구리"
    },
    "types": [
      "Rock",
      "Ground"
    ]
  },
  {
    "id": 76,
    "names": {
      "en": "Golem",
      "fr": "Grolem",
      "de": "Geowaz",
      "es": "Golem",
      "it": "Golem",
      "ja": "ゴローニャ",
      "ko": "딱구리"
    },
    "types": [
      "Rock",
      "Ground"
    ]
  },
  {
    "id": 77,
    "names": {
      "en": "Ponyta",
      "fr": "Ponyta",
      "de": "Ponita",
      "es": "Ponyta",
      "it": "Ponyta",
      "ja": "ポニータ",
      "ko": "포니타"
    },
    "types": [
      "Fire"
    ]
  },
  {
    "id": 78,
    "names": {
      "en": "Rapidash",
      "fr": "Galopa",
      "de": "Gallopa",
      "es": "Rapidash",
      "it": "Rapidash",
      "ja": "ギャロップ",
      "ko": "날쌩마"
    },
    "types": [
      "Fire"
    ]
  },
  {
    "id": 79,
    "names": {
      "en": "Slowpoke",
      "fr": "Ramoloss",
      "de": "Flegmon",
      "es": "Slowpoke",
      "it": "Slowpoke",
      "ja": "ヤドン",
      "ko": "야돈"
    },
    "types": [
      "Water",
      "Psychic"
    ]
  },
  {
    "id": 80,
    "names": {
      "en": "Slowbro",
      "fr": "Flagadoss",
      "de": "Lahmus",
      "es": "Slowbro",
      "it": "Slowbro",
      "ja": "ヤドラン",
      "ko": "야도란"
    },
    "types": [
      "Water",
      "Psychic"
    ]
  },
  {
    "id": 81,
    "names": {
      "en": "Magnemite",
      "fr": "Magnéti",
      "de": "Magnetilo",
      "es": "Magnemite",
      "it": "Magnemite",
      "ja": "コイル",
      "ko": "코일"
    },
    "types": [
      "Electric",
      "Steel"
    ]
  },
  {
    "id": 82,
    "names": {
      "en": "Magneton",
      "fr": "Magnéton",
      "de": "Magneton",
      "es": "Magneton",
      "it": "Magneton",
      "ja": "レアコイル",
      "ko": "레어코일"
    },
    "types": [
      "Electric",
      "Steel"
    ]
  },
  {
    "id": 83,
    "names": {
      "en": "Farfetch'd",
      "fr": "Canarticho",
      "de": "Porenta",
      "es": "Farfetch’d",
      "it": "Farfetch’d",
      "ja": "カモネギ",
      "ko": "파오리"
    },
    "types": [
      "Normal",
      "Flying"
    ]
  },
  {
    "id": 84,
    "names": {
      "en": "Doduo",
      "fr": "Doduo",
      "de": "Dodu",
      "es": "Doduo",
      "it": "Doduo",
      "ja": "ドードー",
      "ko": "두두"
    },
    "types": [
      "Normal",
      "Flying"
    ]
  },
  {
    "id": 85,
    "names": {
      "en": "Dodrio",
      "fr": "Dodrio",
      "de": "Dodri",
      "es": "Dodrio",
      "it": "Dodrio",
      "ja": "ドードリオ",
      "ko": "두트리오"
    },
    "types": [
      "Normal",
      "Flying"
    ]
  },
  {
    "id": 86,
    "names": {
      "en": "Seel",
      "fr": "Otaria",
      "de": "Jurob",
      "es": "Seel",
      "it": "Seel",
      "ja": "パウワウ",
      "ko": "쥬쥬"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 87,
    "names": {
      "en": "Dewgong",
      "fr": "Lamantine",
      "de": "Jugong",
      "es": "Dewgong",
      "it": "Dewgong",
      "ja": "ジュゴン",
      "ko": "쥬레곤"
    },
    "types": [
      "Water",
      "Ice"
    ]
  },
  {
    "id": 88,
    "names": {
      "en": "Grimer",
      "fr": "Tadmorv",
      "de": "Sleima",
      "es": "Grimer",
      "it": "Grimer",
      "ja": "ベトベター",
      "ko": "질퍽이"
    },
    "types": [
      "Poison"
    ]
  },
  {
    "id": 89,
    "names": {
      "en": "Muk",
      "fr": "Grotadmorv",
      "de": "Sleimok",
      "es": "Muk",
      "it": "Muk",
      "ja": "ベトベトン",
      "ko": "질뻐기"
    },
    "types": [
      "Poison"
    ]
  },
  {
    "id": 90,
    "names": {
      "en": "Shellder",
      "fr": "Kokiyas",
      "de": "Muschas",
      "es": "Shellder",
      "it": "Shellder",
      "ja": "シェルダー",
      "ko": "셀러"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 91,
    "names": {
      "en": "Cloyster",
      "fr": "Crustabri",
      "de": "Austos",
      "es": "Cloyster",
      "it": "Cloyster",
      "ja": "パルシェン",
      "ko": "파르셀"
    },
    "types": [
      "Water",
      "Ice"
    ]
  },
  {
    "id": 92,
    "names": {
      "en": "Gastly",
      "fr": "Fantominus",
      "de": "Nebulak",
      "es": "Gastly",
      "it": "Gastly",
      "ja": "ゴース",
      "ko": "고오스"
    },
    "types": [
      "Ghost",
      "Poison"
    ]
  },
  {
    "id": 93,
    "names": {
      "en": "Haunter",
      "fr": "Spectrum",
      "de": "Alpollo",
      "es": "Haunter",
      "it": "Haunter",
      "ja": "ゴースト",
      "ko": "고우스트"
    },
    "types": [
      "Ghost",
      "Poison"
    ]
  },
  {
    "id": 94,
    "names": {
      "en": "Gengar",
      "fr": "Ectoplasma",
      "de": "Gengar",
      "es": "Gengar",
      "it": "Gengar",
      "ja": "ゲンガー",
      "ko": "팬텀"
    },
    "types": [
      "Ghost",
      "Poison"
    ]
  },
  {
    "id": 95,
    "names": {
      "en": "Onix",
      "fr": "Onix",
      "de": "Onix",
      "es": "Onix",
      "it": "Onix",
      "ja": "イワーク",
      "ko": "롱스톤"
    },
    "types": [
      "Rock",
      "Ground"
    ]
  },
  {
    "id": 96,
    "names": {
      "en": "Drowzee",
      "fr": "Soporifik",
      "de": "Traumato",
      "es": "Drowzee",
      "it": "Drowzee",
      "ja": "スリープ",
      "ko": "슬리프"
    },
    "types": [
      "Psychic"
    ]
  },
  {
    "id": 97,
    "names": {
      "en": "Hypno",
      "fr": "Hypnomade",
      "de": "Hypno",
      "es": "Hypno",
      "it": "Hypno",
      "ja": "スリーパー",
      "ko": "슬리퍼"
    },
    "types": [
      "Psychic"
    ]
  },
  {
    "id": 98,
    "names": {
      "en": "Krabby",
      "fr": "Krabby",
      "de": "Krabby",
      "es": "Krabby",
      "it": "Krabby",
      "ja": "クラブ",
      "ko": "크랩"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 99,
    "names": {
      "en": "Kingler",
      "fr": "Krabboss",
      "de": "Kingler",
      "es": "Kingler",
      "it": "Kingler",
      "ja": "キングラー",
      "ko": "킹크랩"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 100,
    "names": {
      "en": "Voltorb",
      "fr": "Voltorbe",
      "de": "Voltobal",
      "es": "Voltorb",
      "it": "Voltorb",
      "ja": "ビリリダマ",
      "ko": "찌리리공"
    },
    "types": [
      "Electric"
    ]
  },
  {
    "id": 101,
    "names": {
      "en": "Electrode",
      "fr": "Électrode",
      "de": "Lektrobal",
      "es": "Electrode",
      "it": "Electrode",
      "ja": "マルマイン",
      "ko": "붐볼"
    },
    "types": [
      "Electric"
    ]
  },
  {
    "id": 102,
    "names": {
      "en": "Exeggcute",
      "fr": "Noeunoeuf",
      "de": "Owei",
      "es": "Exeggcute",
      "it": "Exeggcute",
      "ja": "タマタマ",
      "ko": "아라리"
    },
    "types": [
      "Grass",
      "Psychic"
    ]
  },
  {
    "id": 103,
    "names": {
      "en": "Exeggutor",
      "fr": "Noadkoko",
      "de": "Kokowei",
      "es": "Exeggutor",
      "it": "Exeggutor",
      "ja": "ナッシー",
      "ko": "나시"
    },
    "types": [
      "Grass",
      "Psychic"
    ]
  },
  {
    "id": 104,
    "names": {
      "en": "Cubone",
      "fr": "Osselait",
      "de": "Tragosso",
      "es": "Cubone",
      "it": "Cubone",
      "ja": "カラカラ",
      "ko": "탕구리"
    },
    "types": [
      "Ground"
    ]
  },
  {
    "id": 105,
    "names": {
      "en": "Marowak",
      "fr": "Ossatueur",
      "de": "Knogga",
      "es": "Marowak",
      "it": "Marowak",
      "ja": "ガラガラ",
      "ko": "텅구리"
    },
    "types": [
      "Ground"
    ]
  },
  {
    "id": 106,
    "names": {
      "en": "Hitmonlee",
      "fr": "Kicklee",
      "de": "Kicklee",
      "es": "Hitmonlee",
      "it": "Hitmonlee",
      "ja": "サワムラー",
      "ko": "시라소몬"
    },
    "types": [
      "Fighting"
    ]
  },
  {
    "id": 107,
    "names": {
      "en": "Hitmonchan",
      "fr": "Tygnon",
      "de": "Nockchan",
      "es": "Hitmonchan",
      "it": "Hitmonchan",
      "ja": "エビワラー",
      "ko": "홍수몬"
    },
    "types": [
      "Fighting"
    ]
  },
  {
    "id": 108,
    "names": {
      "en": "Lickitung",
      "fr": "Excelangue",
      "de": "Schlurp",
      "es": "Lickitung",
      "it": "Lickitung",
      "ja": "ベロリンガ",
      "ko": "내루미"
    },
    "types": [
      "Normal"
    ]
  },
  {
    "id": 109,
    "names": {
      "en": "Koffing",
      "fr": "Smogo",
      "de": "Smogon",
      "es": "Koffing",
      "it": "Koffing",
      "ja": "ドガース",
      "ko": "또가스"
    },
    "types": [
      "Poison"
    ]
  },
  {
    "id": 110,
    "names": {
      "en": "Weezing",
      "fr": "Smogogo",
      "de": "Smogmog",
      "es": "Weezing",
      "it": "Weezing",
      "ja": "マタドガス",
      "ko": "또도가스"
    },
    "types": [
      "Poison"
    ]
  },
  {
    "id": 111,
    "names": {
      "en": "Rhyhorn",
      "fr": "Rhinocorne",
      "de": "Rihorn",
      "es": "Rhyhorn",
      "it": "Rhyhorn",
      "ja": "サイホーン",
      "ko": "뿔카노"
    },
    "types": [
      "Ground",
      "Rock"
    ]
  },
  {
    "id": 112,
    "names": {
      "en": "Rhydon",
      "fr": "Rhinoféros",
      "de": "Rizeros",
      "es": "Rhydon",
      "it": "Rhydon",
      "ja": "サイドン",
      "ko": "코뿌리"
    },
    "types": [
      "Ground",
      "Rock"
    ]
  },
  {
    "id": 113,
    "names": {
      "en": "Chansey",
      "fr": "Leveinard",
      "de": "Chaneira",
      "es": "Chansey",
      "it": "Chansey",
      "ja": "ラッキー",
      "ko": "럭키"
    },
    "types": [
      "Normal"
    ]
  },
  {
    "id": 114,
    "names": {
      "en": "Tangela",
      "fr": "Saquedeneu",
      "de": "Tangela",
      "es": "Tangela",
      "it": "Tangela",
      "ja": "モンジャラ",
      "ko": "덩쿠리"
    },
    "types": [
      "Grass"
    ]
  },
  {
    "id": 115,
    "names": {
      "en": "Kangaskhan",
      "fr": "Kangourex",
      "de": "Kangama",
      "es": "Kangaskhan",
      "it": "Kangaskhan",
      "ja": "ガルーラ",
      "ko": "캥카"
    },
    "types": [
      "Normal"
    ]
  },
  {
    "id": 116,
    "names": {
      "en": "Horsea",
      "fr": "Hypotrempe",
      "de": "Seeper",
      "es": "Horsea",
      "it": "Horsea",
      "ja": "タッツー",
      "ko": "쏘드라"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 117,
    "names": {
      "en": "Seadra",
      "fr": "Hypocéan",
      "de": "Seemon",
      "es": "Seadra",
      "it": "Seadra",
      "ja": "シードラ",
      "ko": "시드라"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 118,
    "names": {
      "en": "Goldeen",
      "fr": "Poissirène",
      "de": "Goldini",
      "es": "Goldeen",
      "it": "Goldeen",
      "ja": "トサキント",
      "ko": "콘치"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 119,
    "names": {
      "en": "Seaking",
      "fr": "Poissoroy",
      "de": "Golking",
      "es": "Seaking",
      "it": "Seaking",
      "ja": "アズマオウ",
      "ko": "왕콘치"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 120,
    "names": {
      "en": "Staryu",
      "fr": "Stari",
      "de": "Sterndu",
      "es": "Staryu",
      "it": "Staryu",
      "ja": "ヒトデマン",
      "ko": "별가사리"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 121,
    "names": {
      "en": "Starmie",
      "fr": "Staross",
      "de": "Starmie",
      "es": "Starmie",
      "it": "Starmie",
      "ja": "スターミー",
      "ko": "아쿠스타"
    },
    "types": [
      "Water",
      "Psychic"
    ]
  },
  {
    "id": 122,
    "names": {
      "en": "Mr. Mime",
      "fr": "M. Mime",
      "de": "Pantimos",
      "es": "Mr. Mime",
      "it": "Mr. Mime",
      "ja": "バリヤード",
      "ko": "마임맨"
    },
    "types": [
      "Psychic",
      "Fairy"
    ]
  },
  {
    "id": 123,
    "names": {
      "en": "Scyther",
      "fr": "Insécateur",
      "de": "Sichlor",
      "es": "Scyther",
      "it": "Scyther",
      "ja": "ストライク",
      "ko": "스라크"
    },
    "types": [
      "Bug",
      "Flying"
    ]
  },
  {
    "id": 124,
    "names": {
      "en": "Jynx",
      "fr": "Lippoutou",
      "de": "Rossana",
      "es": "Jynx",
      "it": "Jynx",
      "ja": "ルージュラ",
      "ko": "루주라"
    },
    "types": [
      "Ice",
      "Psychic"
    ]
  },
  {
    "id": 125,
    "names": {
      "en": "Electabuzz",
      "fr": "Élektek",
      "de": "Elektek",
      "es": "Electabuzz",
      "it": "Electabuzz",
      "ja": "エレブー",
      "ko": "에레브"
    },
    "types": [
      "Electric"
    ]
  },
  {
    "id": 126,
    "names": {
      "en": "Magmar",
      "fr": "Magmar",
      "de": "Magmar",
      "es": "Magmar",
      "it": "Magmar",
      "ja": "ブーバー",
      "ko": "마그마"
    },
    "types": [
      "Fire"
    ]
  },
  {
    "id": 127,
    "names": {
      "en": "Pinsir",
      "fr": "Scarabrute",
      "de": "Pinsir",
      "es": "Pinsir",
      "it": "Pinsir",
      "ja": "カイロス",
      "ko": "쁘사이저"
    },
    "types": [
      "Bug"
    ]
  },
  {
    "id": 128,
    "names": {
      "en": "Tauros",
      "fr": "Tauros",
      "de": "Tauros",
      "es": "Tauros",
      "it": "Tauros",
      "ja": "ケンタロス",
      "ko": "켄타로스"
    },
    "types": [
      "Normal"
    ]
  },
  {
    "id": 129,
    "names": {
      "en": "Magikarp",
      "fr": "Magicarpe",
      "de": "Karpador",
      "es": "Magikarp",
      "it": "Magikarp",
      "ja": "コイキング",
      "ko": "잉어킹"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 130,
    "names": {
      "en": "Gyarados",
      "fr": "Léviator",
      "de": "Garados",
      "es": "Gyarados",
      "it": "Gyarados",
      "ja": "ギャラドス",
      "ko": "갸라도스"
    },
    "types": [
      "Water",
      "Flying"
    ]
  },
  {
    "id": 131,
    "names": {
      "en": "Lapras",
      "fr": "Lokhlass",
      "de": "Lapras",
      "es": "Lapras",
      "it": "Lapras",
      "ja": "ラプラス",
      "ko": "라프라스"
    },
    "types": [
      "Water",
      "Ice"
    ]
  },
  {
    "id": 132,
    "names": {
      "en": "Ditto",
      "fr": "Métamorph",
      "de": "Ditto",
      "es": "Ditto",
      "it": "Ditto",
      "ja": "メタモン",
      "ko": "메타몽"
    },
    "types": [
      "Normal"
    ]
  },
  {
    "id": 133,
    "names": {
      "en": "Eevee",
      "fr": "Évoli",
      "de": "Evoli",
      "es": "Eevee",
      "it": "Eevee",
      "ja": "イーブイ",
      "ko": "이브이"
    },
    "types": [
      "Normal"
    ]
  },
  {
    "id": 134,
    "names": {
      "en": "Vaporeon",
      "fr": "Aquali",
      "de": "Aquana",
      "es": "Vaporeon",
      "it": "Vaporeon",
      "ja": "シャワーズ",
      "ko": "샤미드"
    },
    "types": [
      "Water"
    ]
  },
  {
    "id": 135,
    "names": {
      "en": "Jolteon",
      "fr": "Voltali",
      "de": "Blitza",
      "es": "Jolteon",
      "it": "Jolteon",
      "ja": "サンダース",
      "ko": "쥬피썬더"
    },
    "types": [
      "Electric"
    ]
  },
  {
    "id": 136,
    "names": {
      "en": "Flareon",
      "fr": "Pyroli",
      "de": "Flamara",
      "es": "Flareon",
      "it": "Flareon",
      "ja": "ブースター",
      "ko": "부스터"
    },
    "types": [
      "Fire"
    ]
  },
  {
    "id": 137,
    "names": {
      "en": "Porygon",
      "fr": "Porygon",
      "de": "Porygon",
      "es": "Porygon",
      "it": "Porygon",
      "ja": "ポリゴン",
      "ko": "폴리곤"
    },
    "types": [
      "Normal"
    ]
  },
  {
    "id": 138,
    "names": {
      "en": "Omanyte",
      "fr": "Amonita",
      "de": "Amonitas",
      "es": "Omanyte",
      "it": "Omanyte",
      "ja": "オムナイト",
      "ko": "암나이트"
    },
    "types": [
      "Rock",
      "Water"
    ]
  },
  {
    "id": 139,
    "names": {
      "en": "Omastar",
      "fr": "Amonistar",
      "de": "Amoroso",
      "es": "Omastar",
      "it": "Omastar",
      "ja": "オムスター",
      "ko": "암스타"
    },
    "types": [
      "Rock",
      "Water"
    ]
  },
  {
    "id": 140,
    "names": {
      "en": "Kabuto",
      "fr": "Kabuto",
      "de": "Kabuto",
      "es": "Kabuto",
      "it": "Kabuto",
      "ja": "カブト",
      "ko": "투구"
    },
    "types": [
      "Rock",
      "Water"
    ]
  },
  {
    "id": 141,
    "names": {
      "en": "Kabutops",
      "fr": "Kabutops",
      "de": "Kabutops",
      "es": "Kabutops",
      "it": "Kabutops",
      "ja": "カブトプス",
      "ko": "투구푸스"
    },
    "types": [
      "Rock",
      "Water"
    ]
  },
  {
    "id": 142,
    "names": {
      "en": "Aerodactyl",
      "fr": "Ptéra",
      "de": "Aerodactyl",
      "es": "Aerodactyl",
      "it": "Aerodactyl",
      "ja": "プテラ",
      "ko": "프테라"
    },
    "types": [
      "Rock",
      "Flying"
    ]
  },
  {
    "id": 143,
    "names": {
      "en": "Snorlax",
      "fr": "Ronflex",
      "de": "Relaxo",
      "es": "Snorlax",
      "it": "Snorlax",
      "ja": "カビゴン",
      "ko": "잠만보"
    },
    "types": [
      "Normal"
    ]
  },
  {
    "id": 144,
    "names": {
      "en": "Articuno",
      "fr": "Artikodin",
      "de": "Arktos",
      "es": "Articuno",
      "it": "Articuno",
      "ja": "フリーザー",
      "ko": "프리져"
    },
    "types": [
      "Ice",
      "Flying"
    ]
  },
  {
    "id": 145,
    "names": {
      "en": "Zapdos",
      "fr": "Électhor",
      "de": "Zapdos",
      "es": "Zapdos",
      "it": "Zapdos",
      "ja": "サンダー",
      "ko": "썬더"
    },
    "types": [
      "Electric",
      "Flying"
    ]
  },
  {
    "id": 146,
    "names": {
      "en": "Moltres",
      "fr": "Sulfura",
      "de": "Lavados",
      "es": "Moltres",
      "it": "Moltres",
      "ja": "ファイヤー",
      "ko": "파이어"
    },
    "types": [
      "Fire",
      "Flying"
    ]
  },
  {
    "id": 147,
    "names": {
      "en": "Dratini",
      "fr": "Minidraco",
      "de": "Dratini",
      "es": "Dratini",
      "it": "Dratini",
      "ja": "ミニリュウ",
      "ko": "미뇽"
    },
    "types": [
      "Dragon"
    ]
  },
  {
    "id": 148,
    "names": {
      "en": "Dragonair",
      "fr": "Draco",
      "de": "Dragonir",
      "es": "Dragonair",
      "it": "Dragonair",
      "ja": "ハクリュー",
      "ko": "신뇽"
    },
    "types": [
      "Dragon"
    ]
  },
  {
    "id": 149,
    "names": {
      "en": "Dragonite",
      "fr": "Dracolosse",
      "de": "Dragoran",
      "es": "Dragonite",
      "it": "Dragonite",
      "ja": "カイリュー",
      "ko": "망나뇽"
    },
    "types": [
      "Dragon",
      "Flying"
    ]
  },
  {
    "id": 150,
    "names": {
      "en": "Mewtwo",
      "fr": "Mewtwo",
      "de": "Mewtu",
      "es": "Mewtwo",
      "it": "Mewtwo",
      "ja": "ミュウツー",
      "ko": "뮤츠"
    },
    "types": [
      "Psychic"
    ]
  },
  {
    "id": 151,
    "names": {
      "en": "Mew",
      "fr": "Mew",
      "de": "Mew",
      "es": "Mew",
      "it": "Mew",
      "ja": "ミュウ",
      "ko": "뮤"
    },
    "types": [
      "Psychic"
    ]
  }
];
