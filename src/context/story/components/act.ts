import { actions } from "astro:actions";
import { err, ok, type Result } from "../../../utils/Result";

export function act(playerId: string) {
  return async (
    action: string
  ): Promise<Result<{ actor: string; text: string }, Error>> => {
    const { data, error } = await actions.generateText({
      player: playerId,
      prompt: action,
    });

    if (error) {
      console.error("ERROR: generateText", error);
      return err(error);
    }

    if (data && data.message) {
      return ok({
        actor: "Game Master",
        text: data.message,
      });
    }

    return err(new Error("No message received!"));
  };
}
