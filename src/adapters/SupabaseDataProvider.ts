import { supabase, Database } from '../lib/supabase'
import { DataProvider } from '../core/ports'
import { Driver, Bus, Route, Trip, Payment, SOSEvent, Settings } from '../core/types'

// Type mappings between database and application types
type DbDriver = Database['public']['Tables']['drivers']['Row']
type DbBus = Database['public']['Tables']['buses']['Row']
type DbRoute = Database['public']['Tables']['routes']['Row']
type DbTrip = Database['public']['Tables']['trips']['Row']
type DbPayment = Database['public']['Tables']['payments']['Row']
type DbSOSEvent = Database['public']['Tables']['sos_events']['Row']

// Conversion functions from database types to application types
const convertDbDriverToDriver = (dbDriver: DbDriver): Driver => ({
  id: dbDriver.id,
  fullName: dbDriver.full_name,
  phone: dbDriver.phone,
  email: dbDriver.email || undefined,
  rating: Number(dbDriver.rating),
  joinedAt: new Date(dbDriver.joined_at),
  status: dbDriver.status,
  assignedBusId: dbDriver.assigned_bus_id || undefined,
  assignedRouteIds: dbDriver.assigned_route_ids || undefined,
  totalDistanceKm: Number(dbDriver.total_distance_km) || undefined,
  totalTrips: dbDriver.total_trips || undefined,
})

const convertDbBusToBus = (dbBus: DbBus): Bus => ({
  id: dbBus.id,
  busNumber: dbBus.bus_number,
  vehicleType: dbBus.vehicle_type,
  active: dbBus.active,
  assignedDriverId: dbBus.assigned_driver_id || undefined,
  notes: dbBus.notes || undefined,
  currentLocation: dbBus.current_location ? {
    lat: (dbBus.current_location as any).coordinates[1],
    lng: (dbBus.current_location as any).coordinates[0]
  } : undefined,
  fuelEfficiency: Number(dbBus.fuel_efficiency) || undefined,
})

const convertDbRouteToRoute = (dbRoute: DbRoute): Route => ({
  id: dbRoute.id,
  name: dbRoute.name,
  code: dbRoute.code,
  startLocation: dbRoute.start_location,
  endLocation: dbRoute.end_location,
  priorityScore: dbRoute.priority_score,
  distanceKm: Number(dbRoute.distance_km) || undefined,
  estimatedDurationMinutes: dbRoute.estimated_duration_minutes || undefined,
  waypoints: dbRoute.waypoints as any[] || undefined,
})

const convertDbTripToTrip = (dbTrip: DbTrip): Trip => ({
  id: dbTrip.id,
  passengerId: dbTrip.passenger_id || undefined,
  driverId: dbTrip.driver_id,
  busId: dbTrip.bus_id,
  routeId: dbTrip.route_id,
  distance: Number(dbTrip.distance) || undefined,
  cost: Number(dbTrip.cost) || undefined,
  accepted: dbTrip.accepted || false,
  started: dbTrip.started || false,
  canceled: dbTrip.canceled || false,
  arrived: dbTrip.arrived || false,
  reachedDestination: dbTrip.reached_destination || false,
  tripCompleted: dbTrip.trip_completed || false,
  startedAt: dbTrip.started_at ? new Date(dbTrip.started_at) : undefined,
  endedAt: dbTrip.ended_at ? new Date(dbTrip.ended_at) : undefined,
  fuelPricePerLitre: Number(dbTrip.fuel_price_per_litre) || undefined,
  pickupLocation: dbTrip.pickup_location as any || undefined,
  dropoffLocation: dbTrip.dropoff_location as any || undefined,
})

const convertDbPaymentToPayment = (dbPayment: DbPayment): Payment => ({
  id: dbPayment.id,
  tripId: dbPayment.trip_id,
  amount: Number(dbPayment.amount),
  paymentMethod: dbPayment.payment_method,
  status: dbPayment.status,
  transactionId: dbPayment.transaction_id || undefined,
  paymentGateway: dbPayment.payment_gateway || undefined,
  createdAt: new Date(dbPayment.created_at),
})

const convertDbSOSEventToSOSEvent = (dbSOS: DbSOSEvent): SOSEvent => ({
  id: dbSOS.id,
  driverId: dbSOS.driver_id,
  busId: dbSOS.bus_id || undefined,
  location: {
    lat: (dbSOS.location as any).coordinates[1],
    lng: (dbSOS.location as any).coordinates[0]
  },
  address: dbSOS.address || undefined,
  type: dbSOS.type,
  description: dbSOS.description || undefined,
  status: dbSOS.status,
  priority: dbSOS.priority,
  resolvedAt: dbSOS.resolved_at ? new Date(dbSOS.resolved_at) : undefined,
  resolvedBy: dbSOS.resolved_by || undefined,
  createdAt: new Date(dbSOS.created_at),
})

export class SupabaseDataProvider implements DataProvider {
  // Settings
  async getSettings(): Promise<Settings> {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')

    if (error) {
      console.error('Error fetching settings:', error)
      throw error
    }

    // Convert settings array to Settings object
    const settings: Settings = {
      fuelPricePerLitre: 102.50,
      baseFare: 10.00,
      pricePerKm: 1.20,
      maxTripDistance: 50.0,
      sosAutoResolveMinutes: 30,
      enablePushNotifications: true,
      commissionPercentage: 15.0,
      driverApprovalRequired: true,
      analyticsDataRetentionDays: 365,
      maintenanceMode: false,
    }

    // Override with database values
    data?.forEach(setting => {
      const key = setting.setting_key as keyof Settings
      if (key in settings) {
        (settings as any)[key] = setting.setting_value
      }
    })

    return settings
  }

  async updateSettings(updates: Partial<Settings>): Promise<void> {
    const updatePromises = Object.entries(updates).map(([key, value]) =>
      supabase
        .from('admin_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          category: this.getSettingCategory(key),
          updated_at: new Date().toISOString()
        })
    )

    const results = await Promise.all(updatePromises)
    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      console.error('Error updating settings:', errors)
      throw errors[0].error
    }
  }

  private getSettingCategory(key: string): string {
    const categoryMap: Record<string, string> = {
      fuelPricePerLitre: 'general',
      baseFare: 'general',
      pricePerKm: 'general',
      maxTripDistance: 'general',
      sosAutoResolveMinutes: 'security',
      enablePushNotifications: 'notifications',
      commissionPercentage: 'payments',
      driverApprovalRequired: 'security',
      analyticsDataRetentionDays: 'analytics',
      maintenanceMode: 'general',
    }
    return categoryMap[key] || 'general'
  }

  // Driver operations
  async listDrivers(status?: string): Promise<Driver[]> {
    let query = supabase.from('drivers').select('*').order('created_at', { ascending: false })
    
    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching drivers:', error)
      throw error
    }

    return data?.map(convertDbDriverToDriver) || []
  }

  async createDriver(input: { fullName: string; phone: string }): Promise<Driver> {
    const { data, error } = await supabase
      .from('drivers')
      .insert({
        full_name: input.fullName,
        phone: input.phone,
        email: `${input.fullName.toLowerCase().replace(/\s+/g, '.')}@nextstop.com`,
        status: 'pending',
        rating: 5.0,
        joined_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating driver:', error)
      throw error
    }

    return convertDbDriverToDriver(data)
  }

  async approveAndAssignDriver(input: { driverId: string; busId: string; routeIds: string[] }): Promise<void> {
    const { error: driverError } = await supabase
      .from('drivers')
      .update({
        status: 'approved',
        assigned_bus_id: input.busId,
        assigned_route_ids: input.routeIds,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.driverId)

    if (driverError) {
      console.error('Error updating driver:', driverError)
      throw driverError
    }

    const { error: busError } = await supabase
      .from('buses')
      .update({
        assigned_driver_id: input.driverId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.busId)

    if (busError) {
      console.error('Error updating bus:', busError)
      throw busError
    }
  }

  // Bus operations
  async listBuses(): Promise<Bus[]> {
    const { data, error } = await supabase
      .from('buses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching buses:', error)
      throw error
    }

    return data?.map(convertDbBusToBus) || []
  }

  async createBus(input: { busNumber: string; vehicleType: 'bus' | 'miniBus' | 'auto' | 'other'; notes?: string }): Promise<Bus> {
    const { data, error } = await supabase
      .from('buses')
      .insert({
        bus_number: input.busNumber,
        vehicle_type: input.vehicleType,
        notes: input.notes,
        active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating bus:', error)
      throw error
    }

    return convertDbBusToBus(data)
  }

  // Route operations
  async listRoutes(): Promise<Route[]> {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .order('priority_score', { ascending: false })

    if (error) {
      console.error('Error fetching routes:', error)
      throw error
    }

    return data?.map(convertDbRouteToRoute) || []
  }

  async createRoute(input: { name: string; code: string; priorityScore: number }): Promise<Route> {
    const { data, error } = await supabase
      .from('routes')
      .insert({
        name: input.name,
        code: input.code,
        priority_score: input.priorityScore,
        start_location: '',
        end_location: '',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating route:', error)
      throw error
    }

    return convertDbRouteToRoute(data)
  }

  // Trip operations
  async listTrips(params?: { driverId?: string; routeId?: string; limit?: number }): Promise<Trip[]> {
    let query = supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false })

    if (params?.driverId) {
      query = query.eq('driver_id', params.driverId)
    }

    if (params?.routeId) {
      query = query.eq('route_id', params.routeId)
    }

    if (params?.limit) {
      query = query.limit(params.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching trips:', error)
      throw error
    }

    return data?.map(convertDbTripToTrip) || []
  }

  async listPeakHours(): Promise<{ hour: number; riders: number }[]> {
    // This would typically be a more complex query with aggregations
    // For now, return sample data that could be computed from trips
    const { data, error } = await supabase
      .from('trips')
      .select('started_at')
      .not('started_at', 'is', null)
      .gte('started_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    if (error) {
      console.error('Error fetching peak hours data:', error)
      throw error
    }

    // Group by hour and count
    const hourCounts: Record<number, number> = {}
    data?.forEach(trip => {
      if (trip.started_at) {
        const hour = new Date(trip.started_at).getHours()
        hourCounts[hour] = (hourCounts[hour] || 0) + 1
      }
    })

    return Object.entries(hourCounts).map(([hour, riders]) => ({
      hour: parseInt(hour),
      riders
    })).sort((a, b) => a.hour - b.hour)
  }

  async listPeakRoutes(): Promise<{ routeId: string; routeName: string; riders: number }[]> {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        route_id,
        routes!inner(name)
      `)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    if (error) {
      console.error('Error fetching peak routes data:', error)
      throw error
    }

    // Group by route and count
    const routeCounts: Record<string, { name: string; count: number }> = {}
    data?.forEach(trip => {
      const routeId = trip.route_id
      const routeName = (trip.routes as any)?.name || 'Unknown Route'
      
      if (!routeCounts[routeId]) {
        routeCounts[routeId] = { name: routeName, count: 0 }
      }
      routeCounts[routeId].count++
    })

    return Object.entries(routeCounts).map(([routeId, { name, count }]) => ({
      routeId,
      routeName: name,
      riders: count
    })).sort((a, b) => b.riders - a.riders)
  }

  // Payment operations
  async listPayments(params?: { from?: Date; to?: Date }): Promise<Payment[]> {
    let query = supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })

    if (params?.from) {
      query = query.gte('created_at', params.from.toISOString())
    }

    if (params?.to) {
      query = query.lte('created_at', params.to.toISOString())
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching payments:', error)
      throw error
    }

    return data?.map(convertDbPaymentToPayment) || []
  }

  async getRevenueSummary(params?: { from?: Date; to?: Date }): Promise<{ today: number; week: number; month: number }> {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [todayResult, weekResult, monthResult] = await Promise.all([
      supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', today.toISOString()),
      
      supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', weekAgo.toISOString()),
      
      supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', monthAgo.toISOString())
    ])

    const calculateTotal = (data: any[] | null) => 
      data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0

    return {
      today: calculateTotal(todayResult.data),
      week: calculateTotal(weekResult.data),
      month: calculateTotal(monthResult.data)
    }
  }

  // SOS operations
  async listSOSEvents(status?: string): Promise<SOSEvent[]> {
    let query = supabase
      .from('sos_events')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching SOS events:', error)
      throw error
    }

    return data?.map(convertDbSOSEventToSOSEvent) || []
  }

  async resolveSOSEvent(eventId: string, resolvedBy: string): Promise<void> {
    const { error } = await supabase
      .from('sos_events')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolved_by: resolvedBy,
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventId)

    if (error) {
      console.error('Error resolving SOS event:', error)
      throw error
    }
  }

  // Real-time subscriptions
  subscribeToDrivers(callback: (drivers: Driver[]) => void) {
    const subscription = supabase
      .channel('drivers_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'drivers' },
        () => {
          this.listDrivers().then(callback)
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }

  subscribeToBuses(callback: (buses: Bus[]) => void) {
    const subscription = supabase
      .channel('buses_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'buses' },
        () => {
          this.listBuses().then(callback)
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }

  subscribeToTrips(callback: (trips: Trip[]) => void) {
    const subscription = supabase
      .channel('trips_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'trips' },
        () => {
          this.listTrips().then(callback)
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }

  subscribeToSOSEvents(callback: (events: SOSEvent[]) => void) {
    const subscription = supabase
      .channel('sos_events_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'sos_events' },
        () => {
          this.listSOSEvents().then(callback)
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }
}
