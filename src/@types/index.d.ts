declare module "chainlinked" {
    export interface Game {
        words: Word[];
        mistakesRemaining: number;
        gameKey: string;
    }

    export interface Word {
        guesses: string[];
        text: string;
        revealed: boolean;
        unlocked: boolean;
        strikes: number;
    }
}