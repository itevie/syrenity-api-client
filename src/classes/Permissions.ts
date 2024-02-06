import Bitfield from "../PermissionBitfield.js";

export default class Permissions {
  public bitfield: number;

  constructor(bitfield: number) {
    this.bitfield = bitfield;
  }

  public static bitfieldHasPermission(bitfield: number, permission: (keyof typeof Bitfield) | number): boolean {
    // Check if the bitfield has administrator
    if (bitfield & Bitfield.ADMINISTRATOR) return true;
    return (bitfield 
      & (!Number.isNaN(parseInt(permission.toString())) 
        ? permission
        : bitfield[permission])) !== 0;
  }

  public hasPermission(permission: (keyof typeof Bitfield) | number): boolean {
    return Permissions.bitfieldHasPermission(this.bitfield, permission);
  }
}