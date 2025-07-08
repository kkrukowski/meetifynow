# Testy dla MeetifyNow

Ten folder zawiera testy dla aplikacji MeetifyNow, sprawdzające funkcjonalność tworzenia spotkań i odpowiadania na spotkania.

## Struktura testów

### 1. `CreateMeeting.test.tsx`

Testy komponentu CreateMeeting sprawdzające:

- Renderowanie komponentu
- Walidację formularza (nazwa spotkania, miejsce, link)
- Przechodzenie między krokami
- Wybór dat i godzin
- Tworzenie spotkania
- Obsługę błędów

### 2. `AnswerMeeting.test.tsx`

Testy komponentu AnswerMeeting sprawdzające:

- Renderowanie komponentu
- Walidację nazwy użytkownika
- Wybór terminów
- Wysyłanie odpowiedzi
- Wyświetlanie istniejących odpowiedzi
- Obsługę błędów

### 3. `TimeFunctions.test.ts`

Testy funkcji pomocniczych do zarządzania czasem:

- Generowanie nazw dni
- Zarządzanie przedziałami czasowymi
- Walidację dat i godzin
- Obliczenia czasowe

### 4. `MeetingIntegration.test.tsx`

Testy integracyjne sprawdzające:

- Pełny przepływ tworzenia spotkania
- Pełny przepływ odpowiadania na spotkanie
- Obsługę błędów sieciowych
- Zarządzanie strefami czasowymi

## Uruchamianie testów

```bash
# Uruchomienie wszystkich testów
npm test

# Uruchomienie testów w trybie watch
npm run test:watch

# Uruchomienie testów z pokryciem kodu
npm run test:coverage
```

## Konfiguracja

Testy używają następujących narzędzi:

- **Vitest** - framework testowy
- **@testing-library/react** - narzędzia do testowania komponentów React
- **@testing-library/jest-dom** - dodatkowe matchery dla DOM
- **happy-dom** - środowisko DOM dla testów

## Mockowanie

Testy mockują następujące zależności:

- `axios` - dla zapytań HTTP
- `next/navigation` - dla routingu Next.js
- `moment` - dla operacji na datach
- `framer-motion` - dla animacji
- `react-responsive` - dla responsywności

## Struktura testów

Każdy test składa się z:

1. **Setup** - przygotowanie środowiska i mocków
2. **Arrange** - przygotowanie danych testowych
3. **Act** - wykonanie akcji testowej
4. **Assert** - weryfikacja wyników

## Przykład testu

```typescript
it("validates required meeting name", async () => {
  render(<CreateMeeting lang="en" dict={mockDict} auth={mockAuth} />);

  const nextButton = screen.getByText("Next");
  fireEvent.click(nextButton);

  await waitFor(() => {
    expect(screen.getByText("Meeting name is required")).toBeInTheDocument();
  });
});
```

## Dodawanie nowych testów

Przy dodawaniu nowych funkcjonalności:

1. Dodaj testy jednostkowe dla nowych funkcji
2. Dodaj testy komponentów dla nowych komponentów
3. Zaktualizuj testy integracyjne jeśli zmieniasz przepływ
4. Upewnij się, że wszystkie testy przechodzą

## Pokrycie kodu

Testy powinny pokrywać:

- Wszystkie główne funkcjonalności
- Przypadki brzegowe
- Obsługę błędów
- Walidację danych
- Interakcje użytkownika

Uruchom `npm run test:coverage` aby zobaczyć aktualny poziom pokrycia kodu.
