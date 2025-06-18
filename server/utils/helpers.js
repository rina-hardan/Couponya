export function calculateAge(birthDateString) {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
  export function mergeAndRankCoupons(byAge, byRegion, general, weights) {
    const couponsMap = new Map();
    addCoupons(byAge, "byAge");
    addCoupons(byRegion, "byRegion");
    addCoupons(general, "general");
  
    return Array.from(couponsMap.values()).sort((a, b) => b.score - a.score);
  }
  function addCoupons(coupons, weightKey) {
      const weight = weights[weightKey];
      for (const c of coupons) {
        const id = c.id;
        const popularity = c.popularity || 0;
        const score = popularity * weight;
  
        if (couponsMap.has(id)) {
          couponsMap.get(id).score += score;
        } else {
          couponsMap.set(id, { ...c, score });
        }
      }
    } 