export default function(enm) {
  switch (enm) {
    case 'ADMIN':
      return 1;
    case 'MEDICO':
      return 2;
    case 'FUNCIONARIO':
      return 3;
    case 'PACIENTE':
      return 4;
    default:
      return null;
  }
}
