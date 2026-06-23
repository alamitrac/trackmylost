<?php

namespace App\Services;

use App\Models\Post;

/**
 * Intelligent lost ↔ found matching (Feature 9).
 * Scores opposite-type reports on category, keyword overlap, location, and
 * date proximity, returning a similarity score in [0, 1].
 */
class MatchService
{
    /** Opposite-type candidates above the threshold, ranked by score. */
    public static function find(Post $post, int $limit = 5, float $threshold = 0.30): array
    {
        $opposite = $post->type === 'lost' ? 'found' : 'lost';

        $candidates = Post::with('category')
            ->where('type', $opposite)
            ->where('hidden', false)
            ->where('id', '!=', $post->id)
            ->latest('id')->limit(200)->get();

        $scored = [];
        foreach ($candidates as $c) {
            $score = self::score($post, $c);
            if ($score >= $threshold) {
                $scored[] = ['post' => $c, 'score' => $score];
            }
        }
        usort($scored, fn ($a, $b) => $b['score'] <=> $a['score']);
        return array_slice($scored, 0, $limit);
    }

    /** Similarity score in [0,1] between two reports. */
    public static function score(Post $a, Post $b): float
    {
        $score = 0.0;

        if ($a->category_id && $a->category_id == $b->category_id) {
            $score += 0.30;
        }

        $wa = self::keywords($a->title . ' ' . $a->description);
        $wb = self::keywords($b->title . ' ' . $b->description);
        if ($wa && $wb) {
            $inter = count(array_intersect($wa, $wb));
            $union = count(array_unique(array_merge($wa, $wb)));
            $score += $union ? min(0.40, ($inter / $union) * 0.9) : 0;
        }

        $la = self::keywords($a->location);
        $lb = self::keywords($b->location);
        if ($la && $lb && count(array_intersect($la, $lb))) {
            $score += 0.20;
        }

        $days = abs(strtotime((string) $a->created_at) - strtotime((string) $b->created_at)) / 86400;
        if ($days <= 14) {
            $score += 0.10 * (1 - $days / 14);
        }

        return $score;
    }

    /** Tokenize into meaningful keywords (lowercased, stop-words removed). */
    public static function keywords($text): array
    {
        $stop = ['les', 'des', 'une', 'dans', 'pour', 'avec', 'the', 'and', 'lost', 'found',
            'perdu', 'perdue', 'trouve', 'trouvé', 'trouvée', 'mon', 'mes', 'ma', 'de', 'du',
            'la', 'le', 'un', 'et', 'sur', 'pres', 'près', 'near'];
        $text = mb_strtolower((string) $text);
        $text = preg_replace('/[^a-z0-9àâäéèêëîïôöùûüç ]/u', ' ', $text);
        $parts = preg_split('/\s+/', trim($text)) ?: [];
        $out = [];
        foreach ($parts as $p) {
            if (mb_strlen($p) > 2 && !in_array($p, $stop)) {
                $out[] = $p;
            }
        }
        return array_values(array_unique($out));
    }
}
