const POSITION_LABELS: Record<string, string> = {
  POINT_GUARD: 'Point guard',
  SHOOTING_GUARD: 'Shooting guard',
  SMALL_FORWARD: 'Small forward',
  POWER_FORWARD: 'Power forward',
  CENTRE: 'Centre',
};

export function positionLabel(value: string | null | undefined): string {
  return value ? POSITION_LABELS[value] ?? value : '—';
}