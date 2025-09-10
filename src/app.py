from fastapi import FastAPI, APIRouter, Query, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Enums and Models
class CuisineType(str, Enum):
    KOREAN = "한식"
    SEAFOOD = "해산물"
    BBQ = "고기구이"
    CAFE = "카페"
    BAKERY = "제과점"
    FUSION = "퓨전"
    TRADITIONAL = "전통음식"

class PriceRange(str, Enum):
    BUDGET = "저렴함"
    MODERATE = "보통"
    EXPENSIVE = "비쌈"

class JejuDistrict(str, Enum):
    JEJU_CITY = "제주시"
    SEOGWIPO = "서귀포시"
    HALLIM = "한림"
    SEONGSAN = "성산"
    JUNGMUN = "중문"
    OREUN = "오른"

class Restaurant(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    cuisine_type: CuisineType
    price_range: PriceRange
    district: JejuDistrict
    address: str
    phone: str
    rating: float = Field(ge=0, le=5)
    average_price: int  # 원 (Korean Won)
    description: str
    image_url: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class RestaurantCreate(BaseModel):
    name: str
    cuisine_type: CuisineType
    price_range: PriceRange
    district: JejuDistrict
    address: str
    phone: str
    rating: float = Field(ge=0, le=5)
    average_price: int
    description: str
    image_url: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "제주도 맛집 찾기 API"}

@api_router.get("/restaurants", response_model=List[Restaurant])
async def get_restaurants(
    cuisine_type: Optional[CuisineType] = None,
    price_range: Optional[PriceRange] = None,
    district: Optional[JejuDistrict] = None,
    search: Optional[str] = None
):
    query = {}
    
    if cuisine_type:
        query["cuisine_type"] = cuisine_type
    if price_range:
        query["price_range"] = price_range
    if district:
        query["district"] = district
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    restaurants = await db.restaurants.find(query).to_list(100)
    return [Restaurant(**restaurant) for restaurant in restaurants]

@api_router.post("/restaurants", response_model=Restaurant)
async def create_restaurant(restaurant: RestaurantCreate):
    restaurant_dict = restaurant.dict()
    restaurant_obj = Restaurant(**restaurant_dict)
    await db.restaurants.insert_one(restaurant_obj.dict())
    return restaurant_obj

@api_router.get("/restaurants/{restaurant_id}", response_model=Restaurant)
async def get_restaurant(restaurant_id: str):
    restaurant = await db.restaurants.find_one({"id": restaurant_id})
    if not restaurant:
        raise HTTPException(status_code=404, detail="맛집을 찾을 수 없습니다")
    return Restaurant(**restaurant)

@api_router.get("/price-comparison")
async def get_price_comparison(cuisine_type: Optional[CuisineType] = None):
    query = {}
    if cuisine_type:
        query["cuisine_type"] = cuisine_type
    
    restaurants = await db.restaurants.find(query).to_list(100)
    
    if not restaurants:
        return {"message": "비교할 맛집이 없습니다"}
    
    # Group by cuisine type and calculate average prices
    price_comparison = {}
    cuisine_stats = {}
    
    for restaurant in restaurants:
        cuisine = restaurant["cuisine_type"]
        if cuisine not in cuisine_stats:
            cuisine_stats[cuisine] = {"total_price": 0, "count": 0, "restaurants": []}
        
        cuisine_stats[cuisine]["total_price"] += restaurant["average_price"]
        cuisine_stats[cuisine]["count"] += 1
        cuisine_stats[cuisine]["restaurants"].append({
            "name": restaurant["name"],
            "price": restaurant["average_price"],
            "district": restaurant["district"]
        })
    
    for cuisine, stats in cuisine_stats.items():
        avg_price = stats["total_price"] / stats["count"]
        price_comparison[cuisine] = {
            "average_price": round(avg_price),
            "restaurant_count": stats["count"],
            "cheapest": min(stats["restaurants"], key=lambda x: x["price"]),
            "most_expensive": max(stats["restaurants"], key=lambda x: x["price"])
        }
    
    return price_comparison

@api_router.get("/districts")
async def get_districts():
    return [{"value": district.value, "label": district.value} for district in JejuDistrict]

@api_router.get("/cuisine-types")
async def get_cuisine_types():
    return [{"value": cuisine.value, "label": cuisine.value} for cuisine in CuisineType]

# Initialize sample data
@api_router.post("/init-sample-data")
async def init_sample_data():
    # Check if data already exists
    existing_count = await db.restaurants.count_documents({})
    if existing_count > 0:
        return {"message": "샘플 데이터가 이미 존재합니다"}
    
    sample_restaurants = [
        {
            "name": "해녀의 집",
            "cuisine_type": CuisineType.SEAFOOD,
            "price_range": PriceRange.MODERATE,
            "district": JejuDistrict.JEJU_CITY,
            "address": "제주시 구좌읍 해녀의집길 123",
            "phone": "064-123-4567",
            "rating": 4.5,
            "average_price": 25000,
            "description": "신선한 해산물과 전통 해녀 요리를 맛볼 수 있는 곳",
            "image_url": "https://images.unsplash.com/photo-1701009203098-3bab61afe474?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwzfHxKZWp1JTIwSXNsYW5kJTIwcmVzdGF1cmFudHN8ZW58MHx8fHwxNzU3NDY4NzQwfDA&ixlib=rb-4.1.0&q=85"
        },
        {
            "name": "올레 국수집",
            "cuisine_type": CuisineType.KOREAN,
            "price_range": PriceRange.BUDGET,
            "district": JejuDistrict.SEOGWIPO,
            "address": "서귀포시 올레길 456",
            "phone": "064-234-5678",
            "rating": 4.8,
            "average_price": 8000,
            "description": "저렴하고 맛있는 제주 전통 국수 전문점",
            "image_url": "https://images.unsplash.com/photo-1749880191161-a7fcab31c4e4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxKZWp1JTIwSXNsYW5kJTIwcmVzdGF1cmFudHN8ZW58MHx8fHwxNzU3NDY4NzQwfDA&ixlib=rb-4.1.0&q=85"
        },
        {
            "name": "제주 흑돼지 구이집",
            "cuisine_type": CuisineType.BBQ,
            "price_range": PriceRange.EXPENSIVE,
            "district": JejuDistrict.JUNGMUN,
            "address": "중문관광단지 흑돼지길 789",
            "phone": "064-345-6789",
            "rating": 4.3,
            "average_price": 45000,
            "description": "프리미엄 제주 흑돼지 전문 구이 맛집",
            "image_url": "https://images.unsplash.com/photo-1593343534320-75e59f3f4232?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxKZWp1JTIwSXNsYW5kJTIwcmVzdGF1cmFudHN8ZW58MHx8fHwxNzU3NDY4NzQwfDA&ixlib=rb-4.1.0&q=85"
        },
        {
            "name": "카페 한라산",
            "cuisine_type": CuisineType.CAFE,
            "price_range": PriceRange.MODERATE,
            "district": JejuDistrict.HALLIM,
            "address": "한림읍 카페거리 101",
            "phone": "064-456-7890",
            "rating": 4.6,
            "average_price": 12000,
            "description": "한라산 전망과 함께 즐기는 제주 원두 커피",
            "image_url": "https://images.pexels.com/photos/20122550/pexels-photo-20122550.jpeg"
        },
        {
            "name": "성산 일출 베이커리",
            "cuisine_type": CuisineType.BAKERY,
            "price_range": PriceRange.BUDGET,
            "district": JejuDistrict.SEONGSAN,
            "address": "성산읍 일출로 202",
            "phone": "064-567-8901",
            "rating": 4.4,
            "average_price": 6000,
            "description": "신선한 빵과 제주 감귤을 이용한 베이커리",
            "image_url": "https://images.pexels.com/photos/1698439/pexels-photo-1698439.jpeg"
        },
        {
            "name": "제주 전통 한정식",
            "cuisine_type": CuisineType.TRADITIONAL,
            "price_range": PriceRange.EXPENSIVE,
            "district": JejuDistrict.JEJU_CITY,
            "address": "제주시 전통음식길 303",
            "phone": "064-678-9012",
            "rating": 4.7,
            "average_price": 35000,
            "description": "제주도 고유의 전통 한정식과 향토 요리",
            "image_url": "https://images.unsplash.com/photo-1661366394743-fe30fe478ef7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwyfHxLb3JlYW4lMjBmb29kfGVufDB8fHx8MTc1NzQ2ODc0OHww&ixlib=rb-4.1.0&q=85"
        }
    ]
    
    # Insert sample data
    for restaurant_data in sample_restaurants:
        restaurant_obj = Restaurant(**restaurant_data)
        await db.restaurants.insert_one(restaurant_obj.dict())
    
    return {"message": f"{len(sample_restaurants)}개의 샘플 맛집 데이터가 추가되었습니다"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()