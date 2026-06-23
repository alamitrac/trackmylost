<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        $type = fake()->randomElement(['lost', 'found']);

        $lostTitles = [
            'Lost black wallet near central park',
            'Missing house keys with red keychain',
            'Lost iPhone 14 Pro in blue case',
            'Missing brown leather backpack',
            'Lost gold bracelet with engraving',
            'Missing prescription glasses in black case',
            'Lost passport in transparent folder',
            'Missing AirPods Pro in white case',
        ];

        $foundTitles = [
            'Found set of car keys on park bench',
            'Found small grey kitten near the station',
            'Found wallet with ID cards inside',
            'Found childrens blue jacket at the bus stop',
            'Found silver ring on the pavement',
            'Found university student card',
            'Found pair of sunglasses on a cafe table',
            'Found bicycle helmet near the bike rack',
        ];

        $locations = [
            'Casablanca - Maarif',
            'Rabat - Agdal',
            'Marrakech - Gueliz',
            'Tangier - City Center',
            'Fes - Ville Nouvelle',
            'Agadir - Beach Area',
            'Oujda - Downtown',
            'Tetouan - Medina',
        ];

        return [
            'user_id'     => User::query()->inRandomOrder()->value('id') ?? User::factory(),
            'category_id' => Category::query()->inRandomOrder()->value('id') ?? Category::factory(),
            'title'       => $type === 'lost'
                ? fake()->randomElement($lostTitles)
                : fake()->randomElement($foundTitles),
            'description' => fake()->paragraph(4),
            'type'        => $type,
            'urgency'     => $type === 'found'
                ? 'normal'
                : fake()->randomElement(['max', 'medium', 'low', 'low', 'medium']),
            'location'    => fake()->randomElement($locations),
            'status'      => fake()->randomElement(['open', 'open', 'open', 'resolved']),
            'image'       => 'https://picsum.photos/seed/' . fake()->unique()->numberBetween(1, 100000) . '/600/400',
        ];
    }
}
