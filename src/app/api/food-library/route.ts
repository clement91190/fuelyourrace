import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { FoodItem, Brand, FoodLibrary, NutritionFacts, FoodCategory } from "@/types";

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

export async function GET() {
  try {
    if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      throw new Error("Missing Google Sheets credentials");
    }

    const serviceAccountAuth = new JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const brands: { [key: string]: Brand } = {};
    const items: FoodItem[] = [];

    rows.forEach((row, _index) => {
      // if (index === 0) return; // Skip header row

      const brandName = row.get('Brand');
      if (!brands[brandName]) {
        brands[brandName] = {
          id: brandName.toLowerCase().replace(/\s+/g, '-'),
          name: brandName,
          iconUrl: row.get('Brand Icon URL'),
        };
      }

      const nutritionFacts: NutritionFacts = {
        calories: Number(row.get('Calories')),
        proteins: Number(row.get('Protein (g)')),
        carbs: Number(row.get('Carbs (g)')),
        sodium: Number(row.get('Sodium (mg)')),
        caffeine: Number(row.get('Caffeine (mg)')),
        volume: Number(row.get('Volume (ml)')),
      }

      items.push({
        id: `${brands[brandName].id}-${row.get('Name').toLowerCase().replace(/\s+/g, '-')}`,
        brand: brands[brandName],
        name: row.get('Name'),
        nutritionFacts,
        category: row.get('Category') as FoodCategory,
        isCustom: false,
        servingSize: row.get('Size(g)'),
        description: row.get('Description')
      });
    });

    const foodLibrary: FoodLibrary = {
      items,
      brands: Object.values(brands),
    };

    return NextResponse.json(foodLibrary);
  } catch (error) {
    console.error('Error fetching food library:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food library' },
      { status: 500 }
    );
  }
} 