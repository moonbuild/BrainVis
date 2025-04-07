import { useMutation } from "@tanstack/react-query";
import { fetchFilterVis } from "../api/filterVis";

export function useFilterVis(){
    return useMutation({
        mutationFn: fetchFilterVis,
    })
}