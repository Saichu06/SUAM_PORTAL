export interface Record {
  id: string;
  deviceName: string;
  status: 'Approved' | 'Denied' | 'Pending Approval' | 'Revoked' | string;
  accessLevel: 'Read' | 'Write' | 'Admin' | 'Execute' | string;
  timestamp: string;
}
