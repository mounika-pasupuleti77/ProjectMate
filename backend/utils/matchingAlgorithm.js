/**
 * Skill-Based Teammate Matching Algorithm
 * Calculates transparent skill match percentage between a project's required skills and a student's listed skills.
 *
 * Match Percentage = (Matched Required Skills Count / Total Required Skills Count) * 100
 */
function calculateSkillMatch(requiredSkills = [], studentSkills = []) {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: []
    };
  }

  // Normalize skills for case-insensitive matching
  const normalizedStudentSkills = (studentSkills || []).map(s => s.trim().toLowerCase());
  const studentSkillsMap = new Map();
  (studentSkills || []).forEach(s => {
    studentSkillsMap.set(s.trim().toLowerCase(), s.trim());
  });

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(reqSkill => {
    const reqNormalized = reqSkill.trim().toLowerCase();
    if (normalizedStudentSkills.includes(reqNormalized)) {
      matchedSkills.push(reqSkill.trim());
    } else {
      missingSkills.push(reqSkill.trim());
    }
  });

  const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return {
    matchPercentage,
    matchedSkills,
    missingSkills
  };
}

module.exports = {
  calculateSkillMatch
};
