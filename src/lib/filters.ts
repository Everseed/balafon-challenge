import { Challenge } from "@prisma/client";

export const filterToday = (challenges: Challenge[]) =>
    {
      let data: Challenge[];
    
      // Filter by status=1, startDate <= now =< endDate
      data = challenges.filter(challenge => {
        const now = new Date();
        return (
            challenge.status === 1 &&
            challenge.startDate && challenge.endDate &&
            challenge.startDate <= now && challenge.endDate >= now
        )
      })
    
      // Sort by endDate ascending
      data.sort( (a, b) => a.endDate!.getTime() - b.endDate!.getTime() );
    
      return data;
    }
    
    export const filterTomorrow = (challenges: Challenge[]) =>
    {
      let data: Challenge[];
    
      // Filter by status=1, startDate >= now
      data = challenges.filter(challenge => {
        const now = new Date();
        return (
            challenge.status === 1 &&
            challenge.startDate &&
            challenge.startDate >= now
        )
      })
    
      // Sort by startDate ascending
      data.sort( (a, b) => a.startDate!.getTime() - b.startDate!.getTime() );
    
      return data;
    }
    
    export const filterBroken = (challenges: challenges[]) =>
    {
      let data: Challenge[];
    
      // Filter by status=0
      data = challenges.filter(challenge => {
        return (
            challenge.status === 0
        )
      })
    
      // Sort by updatedAt descending
      data.sort( (a, b) => b.updatedAt!.getTime() - a.updatedAt!.getTime() );
    
      return data;
    }
    
    export const filterFinished = (challenges: Challenge[]) =>
    {
      let data: Challenge[];
    
      // Filter by status=2
      data = challenges.filter(challenge => {
        return (
            challenge.status === 2
        )
      })
    
      // Sort by updatedAt descending
      data.sort( (a, b) => b.updatedAt!.getTime() - a.updatedAt!.getTime() );
    
      return data;
    }