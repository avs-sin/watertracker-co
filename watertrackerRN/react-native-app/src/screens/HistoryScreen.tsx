import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SectionList
} from 'react-native';
import { useSelector } from 'react-redux';
import { format, parseISO, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { RootState } from '../store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CircularProgressView from '../components/CircularProgressView';

type ViewMode = 'day' | 'week' | 'month';

const HistoryScreen: React.FC = ({ navigation }: any) => {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const dailyIntakes = useSelector((state: RootState) => state.intake.dailyIntakes);
  const settings = useSelector((state: RootState) => state.settings);
  
  const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd');

  // Generate data for the current view mode
  const historyData = useMemo(() => {
    switch (viewMode) {
      case 'day': {
        const dateKey = formatDateKey(selectedDate);
        const dayData = dailyIntakes[dateKey] || { date: dateKey, intakes: [], totalAmount: 0 };
        
        // Group intakes by drink type
        const groupedByType: Record<string, { type: string, amount: number, count: number }> = {};
        
        dayData.intakes.forEach(intake => {
          if (!groupedByType[intake.type]) {
            groupedByType[intake.type] = { type: intake.type, amount: 0, count: 0 };
          }
          groupedByType[intake.type].amount += intake.amount;
          groupedByType[intake.type].count += 1;
        });
        
        return {
          date: selectedDate,
          totalAmount: dayData.totalAmount,
          percentage: dayData.totalAmount / settings.dailyGoal * 100,
          intakes: dayData.intakes.sort((a, b) => b.timestamp - a.timestamp),
          byType: Object.values(groupedByType).sort((a, b) => b.amount - a.amount)
        };
      }
      
      case 'week': {
        const weekData = [];
        for (let i = 6; i >= 0; i--) {
          const date = subDays(selectedDate, i);
          const dateKey = formatDateKey(date);
          const dayData = dailyIntakes[dateKey] || { date: dateKey, intakes: [], totalAmount: 0 };
          
          weekData.push({
            date,
            formattedDate: format(date, 'EEE'),
            totalAmount: dayData.totalAmount,
            percentage: dayData.totalAmount / settings.dailyGoal * 100
          });
        }
        return weekData;
      }
      
      case 'month': {
        const firstDay = startOfMonth(selectedDate);
        const lastDay = endOfMonth(selectedDate);
        const monthData = [];
        
        const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
        
        daysInMonth.forEach(date => {
          const dateKey = formatDateKey(date);
          const dayData = dailyIntakes[dateKey] || { date: dateKey, intakes: [], totalAmount: 0 };
          
          monthData.push({
            date,
            formattedDate: format(date, 'd'),
            totalAmount: dayData.totalAmount,
            percentage: dayData.totalAmount / settings.dailyGoal * 100
          });
        });
        
        return monthData;
      }
      
      default:
        return [];
    }
  }, [dailyIntakes, selectedDate, viewMode, settings.dailyGoal]);
  
  const renderDayView = () => {
    const { totalAmount, percentage, intakes, byType } = historyData as any;
    
    if (intakes.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="water-off" size={48} color="#DDDDDD" />
          <Text style={styles.emptyStateText}>No drinks recorded for this day</Text>
        </View>
      );
    }
    
    // Create sections for the list
    const sections = [
      { 
        title: 'Summary',
        data: [{ type: 'summary' }]
      },
      {
        title: 'By Drink Type',
        data: byType.map((item: any) => ({ type: 'byType', ...item }))
      },
      {
        title: 'Timeline',
        data: intakes.map((item: any) => ({ type: 'intake', ...item }))
      }
    ];
    
    return (
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.type + index}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item, section }) => {
          if (item.type === 'summary') {
            return (
              <View style={styles.summaryContainer}>
                <CircularProgressView
                  percentage={percentage}
                  radius={70}
                  strokeWidth={10}
                  color="#2196F3"
                  current={totalAmount}
                  max={settings.dailyGoal}
                  unit={settings.measurementUnit}
                />
              </View>
            );
          } else if (item.type === 'byType') {
            const drinkType = item.type;
            return (
              <View style={styles.typeItem}>
                <View style={styles.typeIconContainer}>
                  <Icon 
                    name={getIconForDrinkType(drinkType)} 
                    size={24} 
                    color={getColorForDrinkType(drinkType)} 
                  />
                </View>
                <View style={styles.typeInfo}>
                  <Text style={styles.typeName}>
                    {capitalizeFirstLetter(drinkType)}
                  </Text>
                  <Text style={styles.typeCount}>
                    {item.count} drinks
                  </Text>
                </View>
                <Text style={styles.typeAmount}>
                  {item.amount} {settings.measurementUnit}
                </Text>
              </View>
            );
          } else {
            // Intake item
            return (
              <TouchableOpacity 
                style={styles.intakeItem}
                onPress={() => {
                  navigation.navigate('DrinkDetail', { 
                    id: item.id, 
                    date: formatDateKey(selectedDate) 
                  });
                }}
              >
                <View style={styles.intakeTimeContainer}>
                  <Text style={styles.intakeTime}>
                    {format(new Date(item.timestamp), 'h:mm a')}
                  </Text>
                </View>
                
                <View style={styles.intakeDetails}>
                  <View style={styles.intakeTypeContainer}>
                    <Icon 
                      name={getIconForDrinkType(item.type)} 
                      size={20} 
                      color={getColorForDrinkType(item.type)} 
                      style={styles.intakeIcon}
                    />
                    <Text style={styles.intakeType}>
                      {capitalizeFirstLetter(item.type)}
                    </Text>
                  </View>
                  
                  <Text style={styles.intakeAmount}>
                    {item.amount} {settings.measurementUnit}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
        }}
        contentContainerStyle={styles.sectionListContent}
      />
    );
  };
  
  const renderWeekView = () => {
    const weekData = historyData as Array<{
      date: Date;
      formattedDate: string;
      totalAmount: number;
      percentage: number;
    }>;
    
    return (
      <ScrollView contentContainerStyle={styles.weekContainer}>
        <Text style={styles.weekDateRange}>
          {format(weekData[0].date, 'MMM d')} - {format(weekData[6].date, 'MMM d, yyyy')}
        </Text>
        
        <View style={styles.weekChartContainer}>
          {weekData.map((day, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.weekDayColumn}
              onPress={() => {
                setSelectedDate(day.date);
                setViewMode('day');
              }}
            >
              <View style={styles.weekBarContainer}>
                <View 
                  style={[
                    styles.weekBar,
                    { 
                      height: `${Math.min(day.percentage, 100)}%`,
                      backgroundColor: day.percentage >= 100 ? '#4CAF50' : '#2196F3'
                    }
                  ]}
                />
              </View>
              <Text style={styles.weekDayLabel}>{day.formattedDate}</Text>
              <Text style={styles.weekAmountLabel}>
                {Math.round(day.percentage)}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.weekSummaryContainer}>
          <Text style={styles.weekSummaryTitle}>Weekly Summary</Text>
          
          <View style={styles.weekSummaryStats}>
            <View style={styles.weekSummaryStat}>
              <Text style={styles.weekSummaryValue}>
                {weekData.reduce((sum, day) => sum + day.totalAmount, 0)}
              </Text>
              <Text style={styles.weekSummaryLabel}>
                {settings.measurementUnit}
              </Text>
            </View>
            
            <View style={styles.weekSummaryStat}>
              <Text style={styles.weekSummaryValue}>
                {weekData.filter(day => day.percentage >= 100).length}
              </Text>
              <Text style={styles.weekSummaryLabel}>
                Days at 100%
              </Text>
            </View>
            
            <View style={styles.weekSummaryStat}>
              <Text style={styles.weekSummaryValue}>
                {Math.round(weekData.reduce((sum, day) => sum + day.percentage, 0) / 7)}%
              </Text>
              <Text style={styles.weekSummaryLabel}>
                Daily Average
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };
  
  const renderMonthView = () => {
    const monthData = historyData as Array<{
      date: Date;
      formattedDate: string;
      totalAmount: number;
      percentage: number;
    }>;
    
    // Group days by weeks for calendar view
    const weeks: Array<Array<typeof monthData[0]>> = [];
    let currentWeek: Array<typeof monthData[0]> = [];
    
    monthData.forEach((day, index) => {
      if (index % 7 === 0 && index > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return (
      <ScrollView contentContainerStyle={styles.monthContainer}>
        <Text style={styles.monthTitle}>
          {format(selectedDate, 'MMMM yyyy')}
        </Text>
        
        <View style={styles.calendarHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <Text key={index} style={styles.calendarHeaderDay}>{day}</Text>
          ))}
        </View>
        
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.calendarRow}>
            {week.map((day, dayIndex) => (
              <TouchableOpacity
                key={dayIndex}
                style={styles.calendarDay}
                onPress={() => {
                  setSelectedDate(day.date);
                  setViewMode('day');
                }}
              >
                <Text style={styles.calendarDayNumber}>
                  {day.formattedDate}
                </Text>
                <View 
                  style={[
                    styles.calendarDayDot,
                    { 
                      backgroundColor: getCalendarDotColor(day.percentage),
                      opacity: day.totalAmount > 0 ? 1 : 0
                    }
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        ))}
        
        <View style={styles.monthLegendContainer}>
          <View style={styles.monthLegendItem}>
            <View style={[styles.monthLegendDot, { backgroundColor: '#DDDDDD' }]} />
            <Text style={styles.monthLegendText}>No data</Text>
          </View>
          <View style={styles.monthLegendItem}>
            <View style={[styles.monthLegendDot, { backgroundColor: '#F44336' }]} />
            <Text style={styles.monthLegendText}>0-25%</</Text>
          </View>
          <View style={styles.monthLegendItem}>
            <View style={[styles.monthLegendDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.monthLegendText}>26-50%</</Text>
          </View>
          <View style={styles.monthLegendItem}>
            <View style={[styles.monthLegendDot, { backgroundColor: '#2196F3' }]} />
            <Text style={styles.monthLegendText}>51-99%</</Text>
          </View>
          <View style={styles.monthLegendItem}>
            <View style={[styles.monthLegendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.monthLegendText}>100%+</</Text>
          </View>
        </View>
        
        <View style={styles.monthSummaryContainer}>
          <Text style={styles.monthSummaryTitle}>Monthly Summary</Text>
          
          <View style={styles.monthSummaryStats}>
            <View style={styles.monthSummaryStat}>
              <Text style={styles.monthSummaryValue}>
                {monthData.reduce((sum, day) => sum + day.totalAmount, 0)}
              </Text>
              <Text style={styles.monthSummaryLabel}>
                {settings.measurementUnit}
              </Text>
            </View>
            
            <View style={styles.monthSummaryStat}>
              <Text style={styles.monthSummaryValue}>
                {monthData.filter(day => day.percentage >= 100).length}
              </Text>
              <Text style={styles.monthSummaryLabel}>
                Days at 100%
              </Text>
            </View>
            
            <View style={styles.monthSummaryStat}>
              <Text style={styles.monthSummaryValue}>
                {Math.round(monthData.reduce((sum, day) => sum + day.percentage, 0) / monthData.length)}%
              </Text>
              <Text style={styles.monthSummaryLabel}>
                Daily Average
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };
  
  const getIconForDrinkType = (type: string): string => {
    switch (type) {
      case 'water': return 'water';
      case 'coffee': return 'coffee';
      case 'tea': return 'tea';
      case 'juice': return 'fruit-citrus';
      case 'soda': return 'bottle-soda';
      case 'milk': return 'cup';
      default: return 'cup-water';
    }
  };
  
  const getColorForDrinkType = (type: string): string => {
    switch (type) {
      case 'water': return '#2196F3';
      case 'coffee': return '#795548';
      case 'tea': return '#FF9800';
      case 'juice': return '#FF5722';
      case 'soda': return '#F44336';
      case 'milk': return '#9E9E9E';
      default: return '#9C27B0';
    }
  };
  
  const getCalendarDotColor = (percentage: number): string => {
    if (percentage === 0) return '#DDDDDD';
    if (percentage < 26) return '#F44336';
    if (percentage < 51) return '#FF9800';
    if (percentage < 100) return '#2196F3';
    return '#4CAF50';
  };
  
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate = new Date(selectedDate);
    
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    
    setSelectedDate(newDate);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        
        <View style={styles.viewModeSwitcher}>
          <TouchableOpacity 
            style={[
              styles.viewModeButton,
              viewMode === 'day' && styles.activeViewModeButton
            ]}
            onPress={() => setViewMode('day')}
          >
            <Text 
              style={[
                styles.viewModeButtonText,
                viewMode === 'day' && styles.activeViewModeButtonText
              ]}
            >
              Day
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.viewModeButton,
              viewMode === 'week' && styles.activeViewModeButton
            ]}
            onPress={() => setViewMode('week')}
          >
            <Text 
              style={[
                styles.viewModeButtonText,
                viewMode === 'week' && styles.activeViewModeButtonText
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.viewModeButton,
              viewMode === 'month' && styles.activeViewModeButton
            ]}
            onPress={() => setViewMode('month')}
          >
            <Text 
              style={[
                styles.viewModeButtonText,
                viewMode === 'month' && styles.activeViewModeButtonText
              ]}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.dateNavigator}>
        <TouchableOpacity 
          style={styles.dateNavButton}
          onPress={() => navigateDate('prev')}
        >
          <Icon name="chevron-left" size={24} color="#2196F3" />
        </TouchableOpacity>
        
        <Text style={styles.dateNavText}>
          {viewMode === 'day' && format(selectedDate, 'EEEE, MMMM d, yyyy')}
          {viewMode === 'week' && `Week of ${format(selectedDate, 'MMMM d, yyyy')}`}
          {viewMode === 'month' && format(selectedDate, 'MMMM yyyy')}
        </Text>
        
        <TouchableOpacity 
          style={styles.dateNavButton}
          onPress={() => navigateDate('next')}
        >
          <Icon name="chevron-right" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && renderMonthView()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    paddingBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  viewModeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginVertical: 8,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeViewModeButton: {
    backgroundColor: '#2196F3',
  },
  viewModeButtonText: {
    color: '#666666',
    fontWeight: '500',
  },
  activeViewModeButtonText: {
    color: '#FFFFFF',
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dateNavButton: {
    padding: 4,
  },
  dateNavText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  
  // Day view styles
  sectionListContent: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  summaryContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeInfo: {
    flex: 1,
  },
  typeName: {
    fontSize: 16,
    fontWeight: '500',
  },
  typeCount: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  typeAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  intakeItem: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  intakeTimeContainer: {
    width: 60,
    marginRight: 12,
  },
  intakeTime: {
    fontSize: 14,
    color: '#666666',
  },
  intakeDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  intakeTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  intakeIcon: {
    marginRight: 8,
  },
  intakeType: {
    fontSize: 16,
  },
  intakeAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  
  // Week view styles
  weekContainer: {
    padding: 16,
  },
  weekDateRange: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  weekChartContainer: {
    flexDirection: 'row',
    height: 200,
    marginBottom: 24,
    alignItems: 'flex-end',
  },
  weekDayColumn: {
    flex: 1,
    alignItems: 'center',
  },
  weekBarContainer: {
    height: 160,
    width: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  weekBar: {
    width: 20,
    backgroundColor: '#2196F3',
    borderRadius: 10,
  },
  weekDayLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#666666',
  },
  weekAmountLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  weekSummaryContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  weekSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  weekSummaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekSummaryStat: {
    alignItems: 'center',
    flex: 1,
  },
  weekSummaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
  },
  weekSummaryLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  
  // Month view styles
  monthContainer: {
    padding: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calendarHeaderDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#666666',
  },
  calendarRow: {
    flexDirection: 'row',
    height: 50,
    marginBottom: 8,
  },
  calendarDay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayNumber: {
    fontSize: 14,
    marginBottom: 4,
  },
  calendarDayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  monthLegendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  monthLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  monthLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  monthLegendText: {
    fontSize: 12,
    color: '#666666',
  },
  monthSummaryContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  monthSummaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  monthSummaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthSummaryStat: {
    alignItems: 'center',
    flex: 1,
  },
  monthSummaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2196F3',
  },
  monthSummaryLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
});

export default HistoryScreen;