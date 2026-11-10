-- PROPOSAL (not applied). Adds a nullable MyPlate-style category to food_logs.
alter table food_logs add column if not exists category text
  check (category in ('fruits','vegetables','grains','protein','dairy','other'));

create or replace function myplate_category(name text) returns text
language sql immutable as $$
  select case
    when lower(name) ~ '(apple|banana|berry|orange|grape|melon|mango|peach|pear|fruit)' then 'fruits'
    when lower(name) ~ '(broccoli|spinach|carrot|lettuce|tomato|pepper|onion|cucumber|kale|vegetable|salad)' then 'vegetables'
    when lower(name) ~ '(bread|rice|pasta|oat|cereal|tortilla|noodle|cracker|wheat|quinoa)' then 'grains'
    when lower(name) ~ '(chicken|beef|pork|turkey|fish|salmon|tuna|egg|bean|lentil|tofu|nut|steak)' then 'protein'
    when lower(name) ~ '(milk|cheese|yogurt|yoghurt|butter|cream|kefir)' then 'dairy'
    else 'other'
  end
$$;

-- Backfill (run manually after review):
-- update food_logs set category = myplate_category(food_name) where category is null;
-- App usage: AddFoodScreen sends category: myplate_category-equivalent in JS (or DB trigger);
-- HomeScreen groups today's entries by category to render a MyPlate-style breakdown.
