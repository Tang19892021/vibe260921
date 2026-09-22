import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/types";

const VARIANTS: Record<Category, "default" | "secondary" | "outline" | "destructive"> = {
  공지: "destructive",
  기술: "default",
  일상: "secondary",
  뉴스: "outline",
  질문: "default",
};

export function CategoryBadge({ category }: { category: Category }) {
  return <Badge variant={VARIANTS[category]}>{category}</Badge>;
}
