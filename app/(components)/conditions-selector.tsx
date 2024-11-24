
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Conditions {
    weather: string;
    lighting: string;
    collisionType: string;
}

interface ConditionsSelectorProps {
    conditions: Conditions;
    setConditions: (conditions: Conditions) => void;
}

// Mapping dropdown values to database codes
const WEATHER_MAP = {
    all: "",
    clear: "A",
    cloudy: "B",
    raining: "C",
    snowing: "D",
    fog: "E",
    wind: "G",
    other: "F",
};

const LIGHTING_MAP = {
    all: "",
    daylight: "A",
    "Dusk/Dawn": "B",
    "Dark w/ Street Lights": "C",
    "Dark w/o Street Lights": "D",
    "Dark w/ Malfunctioning Street Lights": "E",
    other: "H",
};

const COLLISION_TYPE_MAP = {
    all: "",
    "Head-on": "A",
    sideswipe: "B",
    "Rear-end": "C",
    broadside: "D",
    "Hit-object": "E",
    overturned: "F",
    "Vehicle/Pedestrian": "G",
};

export const ConditionsSelector = ({ conditions, setConditions }: ConditionsSelectorProps) => {
    return (
        <Card>
            <CardHeader>
                <h1 className="m-0 text-2xl font-bold">Conditions</h1>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {/* Weather Dropdown */}
                    <div>
                        <Label htmlFor="weather-select">Weather</Label>
                        <Select
                            value={Object.keys(WEATHER_MAP).find(
                                (key) => WEATHER_MAP[key as keyof typeof WEATHER_MAP] === conditions.weather
                            ) || "all"} // Find the label from the current state
                            onValueChange={(val) =>
                                setConditions({
                                    ...conditions,
                                    weather: WEATHER_MAP[val as keyof typeof WEATHER_MAP], // Map the label to the database value
                                })
                            }
                        >
                            <SelectTrigger id="weather-select" className="w-[180px]">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                                {Object.entries(WEATHER_MAP).map(([key]) => (
                                    <SelectItem key={key} value={key}>
                                        {key === "all" ? "All" : key.charAt(0).toUpperCase() + key.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Lighting Dropdown */}
                    <div>
                        <Label htmlFor="lighting-select">Lighting</Label>
                        <Select
                            value={Object.keys(LIGHTING_MAP).find(
                                (key) => LIGHTING_MAP[key as keyof typeof LIGHTING_MAP] === conditions.lighting
                            ) || "all"} // Find the label from the current state
                            onValueChange={(val) =>
                                setConditions({
                                    ...conditions,
                                    lighting: LIGHTING_MAP[val as keyof typeof LIGHTING_MAP], // Map the label to the database value
                                })
                            }
                        >
                            <SelectTrigger id="lighting-select" className="w-[180px]">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                                {Object.entries(LIGHTING_MAP).map(([key]) => (
                                    <SelectItem key={key} value={key}>
                                        {key === "all" ? "All" : key.replace(/-/g, " ")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Collision Type Dropdown */}
                    <div>
                        <Label htmlFor="collision-select">Collision Type</Label>
                        <Select
                            value={Object.keys(COLLISION_TYPE_MAP).find(
                                (key) => COLLISION_TYPE_MAP[key as keyof typeof COLLISION_TYPE_MAP] === conditions.collisionType
                            ) || "all"} // Find the label from the current state
                            onValueChange={(val) =>
                                setConditions({
                                    ...conditions,
                                    collisionType: COLLISION_TYPE_MAP[val as keyof typeof COLLISION_TYPE_MAP], // Map the label to the database value
                                })
                            }
                        >
                            <SelectTrigger id="collision-select" className="w-[180px]">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                                {Object.entries(COLLISION_TYPE_MAP).map(([key]) => (
                                    <SelectItem key={key} value={key}>
                                        {key === "all" ? "All" : key.replace(/-/g, " ").charAt(0).toUpperCase() + key.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

