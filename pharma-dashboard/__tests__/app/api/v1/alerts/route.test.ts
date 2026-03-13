/**
 * @jest-environment node
 */
import { GET, POST } from '../../../../../app/api/v1/alerts/route';
import { NextRequest } from 'next/server';

describe('/api/v1/alerts', () => {
  describe('GET', () => {
    it('should return all alerts with totalCount', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/alerts');
      const response = await GET(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThanOrEqual(3);
      expect(typeof json.totalCount).toBe('number');
      expect(json.totalCount).toBeGreaterThanOrEqual(json.data.length);
    });

    it('should filter by programId', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/alerts?programId=PROG001');
      const response = await GET(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      json.data.forEach((alert: { programId: string }) => {
        expect(alert.programId).toBe('PROG001');
      });
    });

    it('should filter by status', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/alerts?status=Active');
      const response = await GET(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      json.data.forEach((alert: { status: string }) => {
        expect(alert.status).toBe('Active');
      });
    });

    it('should ignore "All" status filter', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/alerts?status=All');
      const response = await GET(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.data.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('POST', () => {
    it('should create a new alert', async () => {
      const alertData = {
        programId: 'PROG001',
        program: 'Test Program',
        study: 'Test Study',
        deadline: '2026-06-15',
        channel: ['Email'],
        recurring: 'One-time',
        notifyBefore: [7, 3],
      };

      const request = new NextRequest('http://localhost:3000/api/v1/alerts', {
        method: 'POST',
        body: JSON.stringify(alertData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.id).toBeDefined();
      expect(data.program).toBe('Test Program');
      expect(data.status).toBe('Active');
    });

    it('should return 400 for missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/alerts', {
        method: 'POST',
        body: JSON.stringify({ programId: 'PROG001' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should handle JSON parsing errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/v1/alerts', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });
  });
});
