const dateFormatter = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export const formatDate = (value: string): string => dateFormatter.format(new Date(value))
