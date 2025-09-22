import {
  Home, Briefcase, GraduationCap, Gift, Utensils, Car, Plane,
  ShoppingCart, Film, Book, Shirt, Dumbbell, Dog, Cat, Coffee, Pizza,
  Salad, DollarSign, Euro, Bitcoin, CreditCard, Receipt, Landmark,
  Heart, Sprout, TrendingUp, Wallet, PiggyBank, Tags, Wrench,
  Lightbulb, Gamepad2, Music, Clapperboard, Bus, Train, Ship,
  Bike, Fuel, Hospital, Stethoscope, Pill, Baby, Bone,
  Apple, Carrot, Beef, Fish, GlassWater, Wine, Beer,
  Tv, Radio, Smartphone, Laptop, MousePointer, Keyboard,
  Brush, Palette, Scissors, Hammer, Construction, TreePine,
  Sun, Moon, Star, Cloud, Snowflake, Flame, Droplets, Leaf
} from 'lucide-vue-next'

export const useIcons = () => {
  const iconMap = {
    Home, Briefcase, GraduationCap, Gift, Utensils, Car, Plane,
    ShoppingCart, Film, Book, Shirt, Dumbbell, Dog, Cat, Coffee, Pizza,
    Salad, DollarSign, Euro, Bitcoin, CreditCard, Receipt, Landmark,
    Heart, Sprout, TrendingUp, Wallet, PiggyBank, Tags, Wrench,
    Lightbulb, Gamepad2, Music, Clapperboard, Bus, Train, Ship,
    Bike, Fuel, Hospital, Stethoscope, Pill, Baby, Bone,
    Apple, Carrot, Beef, Fish, GlassWater, Wine, Beer,
    Tv, Radio, Smartphone, Laptop, MousePointer, Keyboard,
    Brush, Palette, Scissors, Hammer, Construction, TreePine,
    Sun, Moon, Star, Cloud, Snowflake, Flame, Droplets, Leaf
  }

  const iconList = Object.keys(iconMap)

  const getIcon = (name: string) => {
    return iconMap[name as keyof typeof iconMap] || Wallet
  }

  return {
    iconList,
    getIcon,
    iconMap
  }
}
