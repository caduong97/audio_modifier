export const timeSpanStringFormatted = (timeSpan: string) => {
  const secondFractionStartingIndex = timeSpan.indexOf(".")
  const secondFractionRemoved = timeSpan.substring(0, secondFractionStartingIndex)
  if (secondFractionRemoved.substring(0,2) === "00") {
    return secondFractionRemoved.substring(3)
  }

  return secondFractionRemoved
}