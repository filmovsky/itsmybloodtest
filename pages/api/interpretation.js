export default async function handler(req, res) {
    if (req.method === 'POST') {
        const apiKey = process.env.OPENAI_API_KEY;

        const prompt = `Podaj maksymalnie szczegółową interpretację tych badań, opisz wszystkie dostępne na wyniku parametry, uwzględniając wszystkie możliwe aspekty kliniczne. Przeanalizuj załączony plik zawierający wyniki badań krwi i/lub moczu pod kątem zgodności z normami laboratoryjnymi. Oceń wszystkie odchylenia od normy oraz przedstaw ich znaczenie kliniczne w kontekście potencjalnych chorób i zaburzeń. Jeśli badania są z rónych dat anlizuj je chronologicznie.
Wskaż możliwe przyczyny każdego odchylenia, bazując na aktualnej wiedzy medycznej, w tym literaturze naukowej. Uwzględnij także zależności między różnymi wynikami (np. wpływ jednego parametru na drugi).
Przedstaw szczegółowe rekomendacje dotyczące:
1. **Stylu życia:** Uwzględnij konkretne zmiany w codziennych nawykach, które mogłyby poprawić wyniki badań. Rozwiń zagadnienia takie jak aktywność fizyczna, sposoby redukcji stresu, higiena snu oraz praktyki wspierające zdrowie psychiczne i fizyczne.
2. **Diety:** Przedstaw szczegółowy plan dietetyczny oparty na wynikach badań, z uwzględnieniem konkretnych produktów spożywczych wspomagających regenerację organizmu i poprawę wyników. Określ zalecane proporcje makroskładników (błonnik, białka, tłuszcze, węglowodany i inne ważne i mające wpływ na zdrowie), produkty wskazane i przeciwwskazane oraz przykładowe posiłki dla pacjenta.
3. **Suplementacji:** Określ szczegółowe dawki, czas trwania oraz konkretne preparaty do ewentualnej suplementacji (np. witaminy, minerały, zioła). Uwzględniaj potencjalne interakcje z innymi lekami, schorzeniami pacjenta i wyniki badań. Rozwiń, jakie substancje mogą najefektywniej poprawić wskazane parametry.
4. **Leczenia farmakologicznego:** Wskaż możliwe opcje leczenia, jeśli są konieczne, w tym jakie leki można zastosować, ich dawkowanie oraz wskazania do ich stosowania. Podaj potencjalne skutki uboczne leczenia oraz alternatywne środki, jeśli występują przeciwwskazania.
5. **Konsultacji lekarskich i dalszych badań:** Opracuj szczegółową listę badań diagnostycznych, które mogą być potrzebne do dalszej oceny zdrowia, wraz z ich uzasadnieniem. Uwzględniaj badania obrazowe, biochemiczne lub hormonalne, jeśli będą odpowiednie.
Uwzględnij szczegółowe wnioski końcowe w formie syntetycznej, ale wyczerpującej, podsumowujące ogólny stan zdrowia pacjenta. Opisz wszelkie potencjalne ryzyka wynikające z obecnych wyników oraz zaproponuj plan działania na najbliższe tygodnie, aby zoptymalizować stan zdrowia. Sformułuj interpretację w sposób przystępny, ale zgodny z aktualnymi wytycznymi medycznymi i standardami diagnostycznymi.
**Rozwiń interpretację, uwzględniając dodatkowe potencjalne zależności między wynikami, bardziej precyzyjne zmiany w stylu życia, diecie, suplementacji oraz leczeniu.** Zaproponuj szczegółowe mechanizmy biologiczne stojące za obserwowanymi wynikami oraz konkretne strategie działania, aby poprawić stan zdrowia pacjenta. Nie pomiń żadnych aspektów klinicznych wyników badań.
The interpretation of the provided laboratory results will involve a detailed analysis of all available parameters, assessing their compliance with established laboratory standards. Any deviations from the norm will be identified and evaluated for their clinical significance, considering potential diseases, disorders, and underlying causes based on current medical knowledge and scientific literature. If the tests were conducted on different dates, the analysis will be performed chronologically to track changes over time. Relationships between different parameters will be explored to identify how one result may influence another and to provide a more comprehensive understanding of the patient’s health status. Lifestyle recommendations will be tailored to the patient’s specific needs based on the test results. These will include detailed guidance on physical activity, stress reduction techniques, sleep hygiene, and other daily habits that support overall health and well-being. A personalized diet plan will also be created, incorporating specific food recommendations designed to aid the body’s regeneration and improve laboratory parameters. Macronutrient ratios such as protein, fats, carbohydrates, and fiber will be specified, alongside lists of recommended and contraindicated foods. Additionally, sample meal ideas will be provided to help implement these changes effectively.
Supplementation strategies will be proposed to address any deficiencies or imbalances highlighted by the results. These recommendations will include detailed information on appropriate substances, their dosages, duration of use, and specific preparations. Possible interactions with existing medications or health conditions will also be considered. Substances with the highest potential for improving abnormal parameters will be emphasized, with a focus on safety and efficacy.
If pharmacological treatment is necessary, potential medication options will be outlined, along with their indications, dosages, and possible side effects. Alternatives will be suggested for patients with contraindications. Furthermore, recommendations for additional diagnostic tests will be included to ensure a thorough assessment of the patient’s health. These may involve imaging studies, biochemical tests, or hormonal evaluations, depending on the context and the findings of the current analysis.
The conclusions will summarize the patient’s overall health status, highlighting any risks associated with the observed results and identifying potential disorders. An actionable plan will be proposed to optimize health outcomes over the coming weeks. This plan will address lifestyle, diet, supplementation, and treatment in a cohesive manner, following current medical guidelines and diagnostic standards. The interpretation will also consider biological mechanisms behind the observed results, offering insights into potential relationships between parameters and precise strategies for improving health outcomes.
`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: prompt },
                    ...req.body.messages
                ]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
