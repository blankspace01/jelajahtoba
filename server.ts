import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Safe initialization of GoogleGenAI Client
  let ai: GoogleGenAI | null = null;
  try {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }

  // API Endpoint for generating itinerary
  app.post('/api/itinerary/generate', async (req, res) => {
    try {
      const { destination, duration, travelStyle } = req.body;
      const targetDestination = destination || 'Lake Toba, North Sumatra';
      const targetDuration = duration || '3 Days, 2 Nights';
      const targetStyle = travelStyle || 'Adventure';

      if (!ai) {
        // Return structured mock fallback data if API key is not yet set or invalid
        return res.json(getFallbackItinerary(targetDestination, targetDuration, targetStyle));
      }

      const prompt = `Create a matching travel itinerary for destination: "${targetDestination}", duration: "${targetDuration}", and travel style: "${targetStyle}".
      Format your response as a strict JSON array of objects representing days.
      Each object in the array must contain:
      - day: number (e.g. 1, 2)
      - title: string (e.g. "Day 1: Arrival & Exploring")
      - stops: array of objects where each stop has:
        - time: string (e.g., "09:00 AM", "02:30 PM")
        - name: string (e.g., "Huta Ginjang View Point")
        - description: string (very concise, max 2 short sentences, e.g., "Panoramic views of the entire lake. Popular spot for paragliding and coffee.")
        - tags: array of strings (e.g., ["Highly Recommended", "Photo Spot", "Outdoor"])
        - category: string (e.g., "Transport", "Photo Spot", "Restaurant", "Sights", "Adventure")
        - duration: string (e.g., "30 mins", "1.5 hours")
        - ticketPrice: number representing estimated entrance/ticket cost in Indonesian Rupiah (IDR, e.g., 20000, or 0 if free)
        - mealPrice: number representing estimated meal/beverage cost in IDR (e.g., 50000, or 0 if not a dining window)
        - transportPrice: number representing transport/gas/fare cost for this stop in IDR (e.g., 150000, or 0)
        - otherPrice: number representing any other shopping/tips/guide costs in IDR (e.g., 10000, or 0)
      Provide exactly the number of days specified by the duration (e.g. 3 days if "3 Days, 2 Nights"). Populate 3 engaging, realistic stops per day. Return ONLY the JSON array.`;

      let daysData = null;
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  stops: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        tags: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        },
                        category: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        ticketPrice: { type: Type.INTEGER },
                        mealPrice: { type: Type.INTEGER },
                        transportPrice: { type: Type.INTEGER },
                        otherPrice: { type: Type.INTEGER }
                      },
                      required: [
                        'time',
                        'name',
                        'description',
                        'tags',
                        'category',
                        'duration',
                        'ticketPrice',
                        'mealPrice',
                        'transportPrice',
                        'otherPrice'
                      ]
                    }
                  }
                },
                required: ['day', 'title', 'stops']
              }
            }
          }
        });

        const text = response.text?.trim() || '[]';
        daysData = JSON.parse(text);
      } catch (err) {
        console.error('Error or parse issue in dynamic AI itinerary generation:', err);
        // Fall back gracefully instead of failing with Http 500 SyntaxError
        daysData = getFallbackItinerary(targetDestination, targetDuration, targetStyle);
      }

      res.json(daysData);
    } catch (error) {
      console.error('Core itinerary route error:', error);
      const { destination, duration, travelStyle } = req.body || {};
      res.json(getFallbackItinerary(destination || 'Lake Toba, North Sumatra', duration || '3 Days, 2 Nights', travelStyle || 'Adventure'));
    }
  });

  // API Endpoint for dynamic weather predictions based on destination
  app.post('/api/weather', async (req, res) => {
    try {
      const { destination } = req.body;
      const targetDestination = destination || 'Lake Toba, North Sumatra';

      if (!ai) {
        return res.json({
          temp: 24,
          condition: 'Perfect conditions for outdoor trips.',
          forecast: 'Sunny intervals, slight mountain breeze'
        });
      }

      const prompt = `Give a realistic average weather forecast temperature (Celsius, number only) and active condition details for traveler planning in "${targetDestination}".
      Return a strict JSON object with fields:
      - temp: number (e.g. 24)
      - condition: string (e.g. "Perfect conditions for water tours")
      - forecast: string (e.g. "Scattered clouds with a gentle cool breeze")`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              temp: { type: Type.NUMBER },
              condition: { type: Type.STRING },
              forecast: { type: Type.STRING }
            },
            required: ['temp', 'condition', 'forecast']
          }
        }
      });

      const text = response.text?.trim() || '{}';
      res.json(JSON.parse(text));
    } catch (error) {
      console.error('Error fetching weather:', error);
      res.json({
        temp: 25,
        condition: 'Warm and perfect for exploring.',
        forecast: 'Mostly sunny with low chance of rain'
      });
    }
  });

  // Integrate Vite for dev, or serve built bundle in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${port}`);
  });
}

function getFallbackItinerary(destination: string, duration: string, style: string) {
  const daysCount = duration.toLowerCase().includes('2 days') ? 2 : 3;
  const isLakeToba = destination.toLowerCase().includes('toba');

  if (isLakeToba) {
    const fullList = [
      {
        day: 1,
        title: 'Day 1: Arrival & Scenic Viewpoints',
        stops: [
          {
            time: '09:00 AM',
            name: 'Arrival & Pick Up at Silangit',
            description: 'Meet your private guide at Silangit International Airport (DTB) and drive toward Balige.',
            tags: ['Transport', 'Silangit'],
            category: 'Transport',
            duration: '30 mins',
            ticketPrice: 0,
            mealPrice: 0,
            transportPrice: 150000,
            otherPrice: 0
          },
          {
            time: '11:30 AM',
            name: 'Huta Ginjang View Point',
            description: 'Breathtaking panoramic views of the main crater basin. Perfect for a morning coffee and pictures.',
            tags: ['Highly Recommended', 'Scenic View'],
            category: 'Photo Spot',
            duration: '1.5 hours',
            ticketPrice: 15000,
            mealPrice: 40000,
            transportPrice: 0,
            otherPrice: 10000
          },
          {
            time: '02:00 PM',
            name: 'The Caldera Sibisa',
            description: 'Walk through the pine forest trails and enjoy the eco-tourism space styled beautifully overlooking the ridges.',
            tags: ['Nature Trail', 'Mild Hike'],
            category: 'Outdoor',
            duration: '2 hours',
            ticketPrice: 20000,
            mealPrice: 0,
            transportPrice: 0,
            otherPrice: 15000
          },
          {
            time: '05:00 PM',
            name: 'Sunset at Bukit Tarabunga',
            description: 'Catch a classic, golden hour sunset high above the sweeping Balige coastline.',
            tags: ['Sunset Highlight'],
            category: 'Photo Spot',
            duration: '1 hour',
            ticketPrice: 10000,
            mealPrice: 35000,
            transportPrice: 0,
            otherPrice: 0
          }
        ]
      },
      {
        day: 2,
        title: 'Day 2: Island Culture & Boat Cruises',
        stops: [
          {
            time: '08:00 AM',
            name: 'Jetty Ferry to Samosir Island',
            description: 'Take a pleasant tourist cargo ferry crossing from Ajibata directly to Tomok Harbor.',
            tags: ['Ferry Ride'],
            category: 'Transport',
            duration: '45 mins',
            ticketPrice: 15000,
            mealPrice: 0,
            transportPrice: 25000,
            otherPrice: 0
          },
          {
            time: '10:00 AM',
            name: 'Tomok Batak Cultural Village',
            description: 'Behold the ancient stone tombs of King Sidabutar and enjoy a traditional Sigale-gale puppet show.',
            tags: ['Cultural Experience', 'Heritage'],
            category: 'Culture',
            duration: '2 hours',
            ticketPrice: 10000,
            mealPrice: 0,
            transportPrice: 0,
            otherPrice: 25000
          },
          {
            time: '01:00 PM',
            name: 'Batu Hoda White Beach',
            description: 'Dine alongside Lake Toba\'s pristine shorelines; paddle boat rides and coconut refreshments are available.',
            tags: ['Beachside Lunch', 'Leisure'],
            category: 'Restaurant',
            duration: '2 hours',
            ticketPrice: 20000,
            mealPrice: 75000,
            transportPrice: 0,
            otherPrice: 10000
          }
        ]
      },
      {
        day: 3,
        title: 'Day 3: Cascading Waterfalls & Departure',
        stops: [
          {
            time: '09:00 AM',
            name: 'Sipiso-piso Waterfall Trail',
            description: 'Wander near the iconic 120-meter drop cascade carving through geological volcanic cliffs.',
            tags: ['Spectacular Hike', 'Waterfall'],
            category: 'Outdoor',
            duration: '2.5 hours',
            ticketPrice: 15000,
            mealPrice: 0,
            transportPrice: 0,
            otherPrice: 10000
          },
          {
            time: '01:00 PM',
            name: 'Traditional lunch in Parapat',
            description: 'Enjoy lake grilled fish (Ikan Mas Arsik) seasoned with native wild Andaliman pepper spices.',
            tags: ['Local Cuisine', 'Foodie Icon'],
            category: 'Restaurant',
            duration: '1.5 hours',
            ticketPrice: 0,
            mealPrice: 85000,
            transportPrice: 0,
            otherPrice: 0
          },
          {
            time: '04:00 PM',
            name: 'Departure to Airport',
            description: 'Return to Silangit Airport for check-in to your flight out with lifetime memories of Sumatra.',
            tags: ['Departure'],
            category: 'Transport',
            duration: '1 hour',
            ticketPrice: 0,
            mealPrice: 0,
            transportPrice: 150000,
            otherPrice: 0
          }
        ]
      }
    ];
    return fullList.slice(0, daysCount);
  } else {
    // Falls back to any destination
    const genericList = [
      {
        day: 1,
        title: `Day 1: Welcome to ${destination}`,
        stops: [
          {
            time: '09:00 AM',
            name: 'Arrival & Connection Transfer',
            description: `Arrive at ${destination} and transfer to your accommodations. Take in the fresh regional atmosphere.`,
            tags: ['Arrival', 'Transport'],
            category: 'Transport',
            duration: '1 hour',
            ticketPrice: 0,
            mealPrice: 0,
            transportPrice: 120000,
            otherPrice: 0
          },
          {
            time: '02:00 PM',
            name: 'Introductory City & Nature Walk',
            description: `Expert-led exploration of the top historic spots and local sights of ${destination}.`,
            tags: ['Highly Recommended', 'Orientation'],
            category: 'Outdoor',
            duration: '3 hours',
            ticketPrice: 30000,
            mealPrice: 0,
            transportPrice: 0,
            otherPrice: 20000
          },
          {
            time: '07:00 PM',
            name: 'Classic Local Gastronomy Experience',
            description: `Dine at a highly curated local venue specializing in local ${style} delicacies.`,
            tags: ['Welcome Dinner'],
            category: 'Restaurant',
            duration: '2 hours',
            ticketPrice: 0,
            mealPrice: 90000,
            transportPrice: 0,
            otherPrice: 0
          }
        ]
      },
      {
        day: 2,
        title: `Day 2: ${style}-focused In-depth Immersion`,
        stops: [
          {
            time: '09:30 AM',
            name: 'Signature Landmark Visit',
            description: `Immerse yourself in spectacular vistas and deep landmarks celebrating the spirit of ${destination}.`,
            tags: ['Aesthetic Spot', 'Peak Adventure'],
            category: 'Sights',
            duration: '3 hours',
            ticketPrice: 50000,
            mealPrice: 0,
            transportPrice: 0,
            otherPrice: 15000
          },
          {
            time: '02:30 PM',
            name: 'Hidden Gems & Local Craft Trails',
            description: `Meet local artisans, join a quick interactive masterclass, and unearth hidden viewpoints.`,
            tags: ['Exclusive Access'],
            category: 'Culture',
            duration: '2.5 hours',
            ticketPrice: 25000,
            mealPrice: 40000,
            transportPrice: 0,
            otherPrice: 30000
          }
        ]
      },
      {
        day: 3,
        title: 'Day 3: Scenic Sights & Hearty Fairwells',
        stops: [
          {
            time: '08:30 AM',
            name: 'Sunrise Panorama Lookout',
            description: 'Ascend to the finest morning viewpoint to capture standard panoramic photos of the landscape.',
            tags: ['Early Morning', 'Scenic view'],
            category: 'Photo Spot',
            duration: '1.5 hours',
            ticketPrice: 15000,
            mealPrice: 0,
            transportPrice: 0,
            otherPrice: 10000
          },
          {
            time: '12:00 PM',
            name: 'Souvenir and Local Fare Hunt',
            description: 'Pack artisan keepsakes, grab local specialty snacks, and finalize check-out.',
            tags: ['Local market'],
            category: 'Culture',
            duration: '2 hours',
            ticketPrice: 0,
            mealPrice: 50000,
            transportPrice: 0,
            otherPrice: 75000
          }
        ]
      }
    ];
    return genericList.slice(0, daysCount);
  }
}

startServer();
