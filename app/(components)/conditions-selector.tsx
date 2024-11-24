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
                            value={conditions.weather || "all"} // Default to "all" when no value is selected
                            onValueChange={(val) =>
                                setConditions({
                                    ...conditions,
                                    weather: val === "all" ? "" : val, // Reset to empty string for "all"
                                })
                            }
                        >
                            <SelectTrigger id="weather-select" className="w-[180px]">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="clear">Clear</SelectItem>
                                <SelectItem value="cloudy">Cloudy</SelectItem>
                                <SelectItem value="raining">Raining</SelectItem>
                                <SelectItem value="snowing">Snowing</SelectItem>
                                <SelectItem value="fog">Fog</SelectItem>
                                <SelectItem value="wind">Wind</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Lighting Dropdown */}
                    <div>
                        <Label htmlFor="lighting-select">Lighting</Label>
                        <Select
                            value={conditions.lighting || "all"} // Default to "all" when no value is selected
                            onValueChange={(val) =>
                                setConditions({
                                    ...conditions,
                                    lighting: val === "all" ? "" : val, // Reset to empty string for "all"
                                })
                            }
                        >
                            <SelectTrigger id="lighting-select" className="w-[180px]">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="daylight">Daylight</SelectItem>
                                <SelectItem value="dusk_dawn">Dusk/Dawn</SelectItem>
                                <SelectItem value="dark">Dark (w/o Street Lights)</SelectItem>
                                <SelectItem value="dark-lights">Dark (w/ Street Lights)</SelectItem>
                                <SelectItem value="dark-malfunction">Dark (w/ Malfunctioning Street Lights)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Collision Type Dropdown */}
                    <div>
                        <Label htmlFor="collision-select">Collision Type</Label>
                        <Select
                            value={conditions.collisionType || "all"} // Default to "all" when no value is selected
                            onValueChange={(val) =>
                                setConditions({
                                    ...conditions,
                                    collisionType: val === "all" ? "" : val, // Reset to empty string for "all"
                                })
                            }
                        >
                            <SelectTrigger id="collision-select" className="w-[180px]">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="head-on">Head-On</SelectItem>
                                <SelectItem value="sideswipe">Sideswipe</SelectItem>
                                <SelectItem value="rear-end">Rear-end</SelectItem>
                                <SelectItem value="broadside">Broadside</SelectItem>
                                <SelectItem value="hit-object">Hit Object</SelectItem>
                                <SelectItem value="overturned">Overturned</SelectItem>
                                <SelectItem value="vehicle-pedestrian">Vehicle/Pedestrian</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


