export interface ValidationResponse {
    apta: boolean
    razon: string
    divisiones: { tema: string, texto: string }[]
}

export interface DerivationResponse {
    question: string
    answers: string[]
    correctAnswers: string[]
}

export function parseResponse(str: string): ValidationResponse | DerivationResponse[] {
    let raw = str.trim();

    // 1. Quitar los fences de markdown tipo ``` o ```json ... ```
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();

    // 2. Intentar parsear directamente
    try {
        return JSON.parse(raw) as ValidationResponse | DerivationResponse[];
    } catch {
        // si falla, seguimos con limpieza adicional
    }

    // 3. Si viene entre comillas dobles inicial/final, quítalas
    if (raw.startsWith('"') && raw.endsWith('"')) {
        raw = raw.slice(1, -1);
    }

    // 4. Sustituir secuencias problemáticas comunes
    raw = raw
        .replace(/\r/g, " ")
        .replace(/\n/g, " ")
        .replace(/\\n/g, " ")
        .replace(/\\"/g, '"')
        .replace(/\\(?!["\\/bfnrtu])/g, "")
        .replace(/[\u0000-\u001F]+/g, "");

    try {
        return JSON.parse(raw) as ValidationResponse | DerivationResponse[];
    } catch (err) {
        console.error("parseResponse error. Raw:", raw);
        throw err;
    }
}


