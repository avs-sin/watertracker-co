//
//  CustomChartView.swift
//  WaterTracker
//
//  Created by Apps4World on 12/14/23.
//

import Charts
import SwiftUI

/// Chart data format
struct ChartData {
    let time: String
    let amount: Double
}

/// Chart timeframe type
enum ChartTimeframe: String, CaseIterable, Identifiable {
    case hourly, daily = "Last 30 Days"
    var id: Int { hashValue }
    var subtitle: String {
        switch self {
        case .hourly: return "Hourly drink intake"
        case .daily: return "Daily drink intake"
        }
    }
}

/// Chart mark type
enum ChartMarkType: Identifiable {
    case bar, line
    var id: Int { hashValue }
    var icon: String {
        switch self {
        case .bar: return "chart.bar.xaxis"
        case .line: return "chart.xyaxis.line"
        }
    }
}

/// Shows a custom chart view for the history flow
struct CustomChartView: View {

    @EnvironmentObject var manager: DataManager
    @State private var timeframe: ChartTimeframe = .hourly
    @State private var chartMarkType: ChartMarkType = .bar

    // MARK: - Main rendering function
    var body: some View {
        VStack(spacing: 20) {
            Picker("", selection: $timeframe) {
                ForEach(ChartTimeframe.allCases) { type in
                    Text(type.rawValue.capitalized).tag(type)
                }
            }.pickerStyle(.segmented)
            ZStack {
                VStack(spacing: 10) {
                    HStack {
                        HStack(spacing: 0) {
                            ChartMarkButton(type: .bar)
                            ChartMarkButton(type: .line)
                        }.frame(width: 80.0, height: 25).background(
                            Color.primaryText.cornerRadius(8.0).opacity(0.07)
                        )
                        Spacer()
                        Text("Unit - \(manager.fluidUnits)")
                    }.font(.system(size: 12, weight: .light))

                    switch timeframe {
                    case .hourly:
                        Chart(data, id: \.time) {
                            if chartMarkType == .bar {
                                ChartBarMark(x: $0.time, y: $0.amount)
                            } else {
                                ChartLineMark(x: $0.time, y: $0.amount)
                            }
                        }.chartScrollPosition(initialX: Date().hour)
                    case .daily:
                        Chart(data, id: \.time) {
                            if chartMarkType == .bar {
                                ChartBarMark(x: $0.time.dateFormat, y: $0.amount)
                            } else {
                                ChartLineMark(x: $0.time.dateFormat, y: $0.amount)
                            }
                        }.chartScrollPosition(initialX: Date().date.dateFormat)
                    }
                    Text(timeframe.subtitle)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundStyle(.primaryText).opacity(0.7)
                }
            }
            .chartScrollableAxes(.horizontal)
            .chartXVisibleDomain(length: 8)
            .frame(height: 220).padding()
            .background(Color.secondaryBackground)
            .cornerRadius(20.0)
        }
    }

    /// Chart bar mark
    private func ChartBarMark(x date: String, y amount: Double) -> BarMark {
        BarMark(x: .value("Date", date), y: .value("Amount", amount))
    }

    /// Chart line mark
    private func ChartLineMark(x date: String, y amount: Double) -> LineMark {
        LineMark(x: .value("Date", date), y: .value("Amount", amount))
    }

    /// Chart data
    private var data: [ChartData] {
        var timeline: [ChartData] = [ChartData]()
        switch timeframe {
        case .hourly:
            for hour in 0..<24 {
                let startTime = Date().startTime(forHour: hour)
                let endTime = Date().endTime(forHour: hour)
                let totalAmount = manager.drinksData
                    .filter { startTime <= $0.date && $0.date <= endTime }
                    .map { $0.convertedAmount }.reduce(0, +)
                timeline.append(
                    ChartData(time: startTime.hour, amount: totalAmount)
                )
            }
        case .daily:
            for day in -7..<30 {
                let startDate = Date().startDate(forDay: day).date
                let totalAmount = manager.drinksData
                    .filter { $0.date.date == startDate }
                    .map { $0.convertedAmount }.reduce(0, +)
                timeline.append(
                    ChartData(time: startDate, amount: totalAmount)
                )
            }
            timeline.reverse()
        }
        return timeline
    }

    /// Chart mark button
    private func ChartMarkButton(type: ChartMarkType) -> some View {
        let isSelected: Bool = chartMarkType == type
        return Button { chartMarkType = type } label: {
            ZStack {
                Color.white.cornerRadius(8.0).opacity(isSelected ? 1 : 0)
                Image(systemName: type.icon).bold()
                    .foregroundColor(.primaryText).opacity(isSelected ? 1 : 0.2)
            }
        }
    }
}

// MARK: - Preview UI
#Preview {
    let manager = DataManager()
    manager.drinksData = chartPreviewData
    return CustomChartView().environmentObject(manager)
}

/// Chart preview data
let chartPreviewData: [DrinkIntake] = [
    .init(date: .from("\(Date().date) 09:00 AM"), amount: 45.0, type: "tea"),
    .init(date: .from("\(Date().date) 10:30 AM"), amount: 25.0, type: "water"),
    .init(date: .from("\(Date().date) 12:30 PM"), amount: 65.0, type: "water"),
    .init(date: .from("\(Date().date) 03:40 PM"), amount: 25.0, type: "water"),
    .init(date: .from("\(Date().date) 04:50 PM"), amount: 55.0, type: "juice"),
    .init(date: .from("\(Date().date) 07:50 PM"), amount: 25.0, type: "juice"),
    .init(date: .from("09-20-2023 07:50 PM"), amount: 25.0, type: "water")
]
