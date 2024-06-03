import { z } from "zod";

export const tweetFormSchema = z.object({
  message: z
    .string()
    .min(1, { message: "메세지를 입력해 주세요." })
    .max(140, { message: "140자를 넘을 수 없습니다." }),
});
