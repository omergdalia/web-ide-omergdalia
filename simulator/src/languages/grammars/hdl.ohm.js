const hdl = `
Hdl <: Base{
  Root := Chip
  Chip = "CHIP" Name OpenBrace ChipBody CloseBrace
  ChipBody = InList? OutList? PartList ClockedList?
  InList = "IN" PinList Semi
  OutList = "OUT" PinList Semi
  PartList = BuiltinPart | Parts
  PinList = List<PinDecl, Comma>
  PinDecl = Name PinWidth?
  PinWidth = OpenSquare decNumber CloseSquare
  BuiltinPart = "BUILTIN" Semi
  Parts = "PARTS:" Part*
  Part = Name "(" Wires ")" Semi
  Wires = List<Wire, Comma>
  Wire = WireSide Equal (WireSide | True | False) 
  WireSide = Name SubBus? 
  SubBus = OpenSquare decNumber subBusRest? CloseSquare
  subBusRest = ".." decNumber
  ClockedList = "CLOCKED" SimplePinList Semi
  SimplePinList = List<Name, Comma>
}`;
export default hdl;
