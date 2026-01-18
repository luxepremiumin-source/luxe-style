import re

with open('src/components/ProductManager.tsx', 'r') as f:
    content = f.read()

# Fix the first weird block where imports were cut off and markers are malformed
pattern1 = r'import\s+{\s+CATEGORY_LABELS,\s+>>>>>>> REPLACE\s+<<<<<<< SEARCH[\s\S]*?>>>>>>> REPLACE'
replacement1 = """import { 
  CATEGORY_LABELS, 
  CATEGORY_OPTIONS_BY_GENDER, 
  COMMON_COLORS, 
  CategoryOption, 
  GenderOption 
} from "@/lib/product-constants";
import { ProductList } from "@/components/ProductList";

type NewProduct = {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: CategoryOption | "";
  targetGender: GenderOption | "";
  images: string; // comma separated
  videos: string; // comma separated
  colors: string[];
  featured: boolean;
  inStock: boolean;
};

type MediaItem = {
  url: string;
  type: "image" | "video";
};

interface ProductManagerProps {
  onBack: () => void;
}

export default function ProductManager({ onBack }: ProductManagerProps) {
  const createProduct = useMutation(api.products.createProduct);
  const products = useQuery(api.products.getAllProducts);
  const updateProduct = useMutation(api.products.updateProduct);
  const deleteProduct = useMutation(api.products.deleteProduct);
  
  const generateUploadUrl = useAction((api as any).storage.generateUploadUrl);
  const resolvePublicUrl = useAction((api as any).storage.resolvePublicUrl);

  const [form, setForm] = useState<NewProduct>({"""

content = re.sub(pattern1, replacement1, content)

# Fix other blocks which are standard <<<<<<< SEARCH ... ======= ... >>>>>>> REPLACE
# We want to keep the content between ======= and >>>>>>> REPLACE (which is the clean code without AI)
pattern2 = r'<<<<<<< SEARCH[\s\S]*?=======\s*([\s\S]*?)>>>>>>> REPLACE'
content = re.sub(pattern2, r'\1', content)

with open('src/components/ProductManager.tsx', 'w') as f:
    f.write(content)
