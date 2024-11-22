
import {CartesianGrid, Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer} from "recharts"

type AccidentData = {
    
    data: {
        year: number;
        count: number;
        //total_injuries: number | null;
        //total_fatalities: number | null;
        //pedestrian_accidents: number;
        //bicycle_accidents: number;
        //motorcycle_accidents: number;
        //truck_accidents: number;
        //alcohol_related: number;
    }[];
}



export function AccidentsByYear({data}: AccidentData){
    return (
        <ResponsiveContainer width = "100%" minHeight={300}>
        <BarChart data={data}>
        <CartesianGrid />
        <XAxis dataKey="year"/>
        <YAxis/>
        <Tooltip cursor={{fill: "transparent"}}></Tooltip>
        <Bar dataKey="count" fill="red" barSize={30} />
        </BarChart>
        </ResponsiveContainer>
    )
}