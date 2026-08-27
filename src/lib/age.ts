/** Calcula idade atual a partir de uma data de nascimento (mês/dia fixos, ano de referência). */
export function calculateAge(birthYear: number, birthMonth: number, birthDay: number, now = new Date()): number {
  let age = now.getFullYear() - birthYear
  const birthdayPassed =
    now.getMonth() + 1 > birthMonth || (now.getMonth() + 1 === birthMonth && now.getDate() >= birthDay)
  if (!birthdayPassed) age--
  return age
}
