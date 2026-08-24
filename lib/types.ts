export type Gender = 'male'|'female'|'unspecified';
export type TarotCard = {position:string;name:string;meaning:string};
export type Analysis = {overallCompatibility:number;closenessPotential:number;relationshipStability:number;conversationCompatibility:number;mutualAwareness:number;comfortPotential:number;awkwardnessRisk:number;misunderstandingRisk:number;communicationDropRisk:number;conflictRisk:number;distancingRisk:number;summary:string;tarotCards:TarotCard[];positiveFactors:string[];cautionFactors:string[];relationshipAdvice:string[]};
