import Anthropic from "@anthropic-ai/sdk";
import { BRAND_VOICE, RESOURCE_LIBRARY, REAL_THREAD_EXAMPLES } from "@/lib/rei-grove-context";

const client = new Anthropic();

export type GeneratedPost = {
  category: string;
  sourceType: "RESOURCE" | "GENERAL";
  sourceRef: string | null;
  postType: "QUESTION" | "POLL" | "SHARE_YOUR_STORY" | "DISCUSSION" | "TIPS_THREAD";
  title: string;
  body: string;
};

const PROPOSE_POSTS_TOOL: Anthropic.Tool = {
  name: "propose_posts",
  description: "Propose a batch of REI Grove forum discussion-starter posts.",
  input_schema: {
    type: "object",
    properties: {
      posts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            category: { type: "string" },
            sourceType: { type: "string", enum: ["RESOURCE", "GENERAL"] },
            sourceRef: {
              type: "string",
              description: "Name of the specific REI Grove resource this post ties to, if sourceType is RESOURCE. Omit for GENERAL.",
            },
            postType: {
              type: "string",
              enum: ["QUESTION", "POLL", "SHARE_YOUR_STORY", "DISCUSSION", "TIPS_THREAD"],
            },
            title: { type: "string", description: "Forum thread title, under 100 characters. No em dashes." },
            body: {
              type: "string",
              description:
                "The forum post body. Exactly 2-3 short sentences, brief and scannable, written like a real member talking casually to other members (not a brand or moderator voice). Never use em dashes.",
            },
          },
          required: ["category", "sourceType", "postType", "title", "body"],
        },
      },
    },
    required: ["posts"],
  },
};

export async function generatePosts(params: {
  category: string;
  postType: string;
  sourceMode: "RESOURCE" | "GENERAL" | "MIX";
  count: number;
  focusResource?: string;
}): Promise<GeneratedPost[]> {
  const { category, postType, sourceMode, count, focusResource } = params;

  const sourceInstruction =
    sourceMode === "RESOURCE"
      ? `Every post must tie back to a specific item from the REI Grove content library below.${focusResource ? ` Focus specifically on "${focusResource}".` : ""} Set sourceType to RESOURCE and sourceRef to the exact resource name.`
      : sourceMode === "GENERAL"
        ? "Write general real estate investing discussion prompts, independent of the content library. Set sourceType to GENERAL and omit sourceRef."
        : "Mix it up: some posts should tie to a specific item from the content library (sourceType RESOURCE, sourceRef set), others should be general investing discussion prompts (sourceType GENERAL, no sourceRef).";

  const postTypeInstruction =
    postType === "MIX"
      ? "Vary the postType across the batch (question, poll, share your story, discussion, tips thread), whatever fits each topic best."
      : `Every post should be of type ${postType}.`;

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    system: `You write short forum discussion-starter posts for the REI Grove community forums. Goal: spark real replies from other members.\n\nSTRICT FORMAT RULES:\n- Body is exactly 2-3 short sentences. Brief and scannable, like something a busy person can read in five seconds.\n- Never use an em dash (—) anywhere in the title or body. Use a period, comma, or separate sentence instead.\n- No corporate or moderator phrasing: no "our community," "we'd love to hear," "here at REI Grove," "as always."\n\n${BRAND_VOICE}\n\nReal threads members have posted (for tone and specificity calibration only, don't copy or lightly reword these):\n${REAL_THREAD_EXAMPLES}\n\nREI Grove content library:\n${RESOURCE_LIBRARY}`,
    messages: [
      {
        role: "user",
        content: `Generate ${count} forum posts for the "${category}" category.\n\n${sourceInstruction}\n\n${postTypeInstruction}\n\nEach post should invite replies: ask a genuine question, invite people to share their own specific numbers/approach/experience, or start a debate. Model the concreteness of the real threads above (real numbers, real scenarios) rather than generic prompts. Keep titles punchy. Call propose_posts with the full batch.`,
      },
    ],
    tools: [PROPOSE_POSTS_TOOL],
    tool_choice: { type: "tool", name: "propose_posts" },
  });

  const toolUse = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );
  if (!toolUse) throw new Error("Model did not return a tool call.");

  const input = toolUse.input as { posts: GeneratedPost[] };
  return input.posts.map((p) => ({
    ...p,
    category,
    sourceRef: p.sourceRef ?? null,
    title: stripEmDashes(p.title),
    body: stripEmDashes(p.body),
  }));
}

function stripEmDashes(text: string): string {
  return text
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/\s+/g, " ")
    .trim();
}
