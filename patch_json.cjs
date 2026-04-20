const fs = require('fs');

const plPath = 'src/app/dictionaries/pl.json';
const enPath = 'src/app/dictionaries/en.json';

let pl = JSON.parse(fs.readFileSync(plPath, 'utf8'));
let en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

pl.page.home = {
    ...pl.page.home,
    demo: {
        date: "Czw, 18 Kwi",
        peopleAvailable: "3 osoby dostępne",
        yourChoice: "Twój wybór"
    },
    hero: {
        learnMore: "Dowiedz się więcej"
    },
    features: {
        subtitle: "Dlaczego MeetifyNow?",
        title: "Planuj spotkania błyskawicznie",
        items: [
            {
                title: "Brak logowania",
                desc: "Zacznij planować od razu, bez tracenia czasu na tworzenie kont i haseł."
            },
            {
                title: "Widok kalendarza",
                desc: "Czytelny, intuicyjny interfejs ułatwiający szybkie znalezienie wspólnego terminu."
            },
            {
                title: "Inteligentne sugerowanie",
                desc: "System sam podpowie optymalne okna czasowe dla całej grupy."
            }
        ]
    },
    benefits: {
        title: "Wszystko, czego potrzebujesz"
    },
    howItWorks: {
        subtitle: "Jak to działa?",
        title: "Planuj. Wybieraj. Spotkaj się.",
        description: "Trzy proste kroki dzielą Cię i Twój zespół od idealnie dopasowanego grafiku. Żadnego błądzenia w e-mailach.",
        steps: [
            {
                title: "1. Zaproponuj terminy",
                desc: "Wybierasz kilka dogodnych dla siebie opcji i zamykasz je w wygenerowanym linku."
            },
            {
                title: "2. Prześlij i zagłosujcie",
                desc: "Udostępniasz widok grupie. Wszyscy anonimowo i sprawnie oddają głos."
            },
            {
                title: "3. Idealny czas",
                desc: "MeetifyNow w sekundy wskaże rozwiązanie pasujące największej liczbie osób."
            }
        ]
    },
    cta: {
        title: "Proste w użyciu. Potężne w działaniu.",
        description: "Przestańcie wymieniać dziesiątki wiadomości w poszukiwaniu jednego pasującego terminu. Dołącz do zadowolonych użytkowników.",
        button: "Zacznij planować"
    }
};

en.page.home = {
    ...en.page.home,
    demo: {
        date: "Thu, 18 Apr",
        peopleAvailable: "3 people available",
        yourChoice: "Your choice"
    },
    hero: {
        learnMore: "Find out more"
    },
    features: {
        subtitle: "Why MeetifyNow?",
        title: "Plan meetings in a flash",
        items: [
            {
                title: "No signup required",
                desc: "Start planning right away, without wasting time creating accounts and passwords."
            },
            {
                title: "Calendar view",
                desc: "Clear, intuitive interface making it easy to find a common date quickly."
            },
            {
                title: "Smart suggestions",
                desc: "The system automatically suggests optimal time windows for the whole group."
            }
        ]
    },
    benefits: {
        title: "Everything you need"
    },
    howItWorks: {
        subtitle: "How does it work?",
        title: "Plan. Choose. Meet.",
        description: "Three simple steps separate you and your team from a perfectly matched schedule. No getting lost in emails.",
        steps: [
            {
                title: "1. Propose dates",
                desc: "Choose a few convenient options and pack them into a generated link."
            },
            {
                title: "2. Send and vote",
                desc: "Share the view with your group. Everyone votes anonymously and efficiently."
            },
            {
                title: "3. Perfect time",
                desc: "MeetifyNow will highlight the solution that suits the most people within seconds."
            }
        ]
    },
    cta: {
        title: "Simple to use. Powerful in action.",
        description: "Stop exchanging dozens of messages searching for a single matching date. Join satisfied users.",
        button: "Start planning"
    }
};

pl.footer = {
  description: "Proste i szybkie zaplanowanie wspólnych spotkań bez rejestracji i niepotrzebnych kroków.",
  createdBy: "Aplikację stworzyła firma",
  developerTitle: "Tworzenie stron internetowych WebDKW",
  developerAlt: "Agencja interaktywna, tworzenie stron i sklepów internetowych WebDKW",
  rights: "meetifynow.com"
};

en.footer = {
  description: "Simple and quick scheduling of mutual meetings without registration and unnecessary steps.",
  createdBy: "The application was created by",
  developerTitle: "WebDKW Web Development",
  developerAlt: "Interactive agency, web development WebDKW",
  rights: "meetifynow.com"
};

fs.writeFileSync(plPath, JSON.stringify(pl, null, 2));
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));

console.log("JSON updated!");
