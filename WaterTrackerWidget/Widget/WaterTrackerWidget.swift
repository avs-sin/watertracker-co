//
//  WaterTrackerWidget.swift
//  WaterTrackerWidget
//
//  Created by Apps4World on 12/14/23.
//

import SwiftUI
import WidgetKit
import AppIntents

/// Widget view
struct WaterTrackerWidgetEntryView : View {
    var entry: Provider.Entry
    let manager: DataManager = DataManager()
    @Environment(\.widgetFamily) var family

    // MARK: - Main rendering function
    var body: some View {
        ZStack {
            switch family {
            case .systemSmall: SmallWidgetView
            case .systemMedium: MediumWidgetView
            default: EmptyView()
            }
        }
    }

    // MARK: - Small Widget
    private var SmallWidgetView: some View {
        ZStack {
            if !manager.showAddGlassView {
                Button(intent: TrackIntent(intent: .showHideGlassView)) {
                    CircularProgressView(target: manager.dailyIntakeGoal, current: manager.todayIntakeAmount, unit: manager.fluidUnits, lineWidth: 15, fontSize: 30, widgetView: true)
                }.tint(.clear).padding(-12).transition(.identity)
            } else {
                Image(.glass).resizable().aspectRatio(contentMode: .fit)
                    .padding(25).offset(y: -10).transition(.identity)
                VStack {
                    Spacer()
                    Button(intent: TrackIntent(intent: .addGlass)) {
                        Text("Add Glass")
                            .font(.system(size: 12, weight: .medium))
                            .padding(6).padding(.horizontal, 8)
                            .background(
                                Color.accentColor.cornerRadius(15.0).opacity(0.8)
                            ).foregroundColor(.white)
                    }.tint(.clear).offset(y: 10).transition(.identity)
                }
            }
            VStack {
                HStack {
                    Image(systemName: "drop.fill")
                        .foregroundStyle(gradient).offset(x: -5)
                    Spacer()
                    if manager.showAddGlassView {
                        Button(intent: TrackIntent(intent: .showHideGlassView)) {
                            Image(systemName: "xmark").font(.system(size: 14))
                        }.tint(.clear).offset(x: 15)
                    }
                }.foregroundColor(.accentColor)
                Spacer()
            }.offset(y: manager.showAddGlassView ? -9 : -5)
        }
    }

    // MARK: - Medium Widget
    private var MediumWidgetView: some View {
        ZStack {
            HStack {
                CircularProgressView(target: manager.dailyIntakeGoal, current: manager.todayIntakeAmount, unit: manager.fluidUnits, lineWidth: 15, fontSize: 30, widgetView: true)
                Spacer()
                ZStack {
                    Rectangle().foregroundColor(.clear)
                    if drink != .water {
                        VStack(spacing: -5) {
                            Text(drink.emoji).font(.system(size: 60))
                            Text(drink.rawValue.capitalized)
                                .font(.system(size: 12)).opacity(0.6)
                        }.offset(y: -20)
                    } else {
                        Image(.glass).resizable().aspectRatio(contentMode: .fit)
                            .padding(25).offset(y: -20)
                    }
                    HStack {
                        Button(intent: TrackIntent(intent: .previousDrink)) {
                            Image(systemName: "chevron.left.circle.fill")
                                .foregroundStyle(gradient)
                        }.tint(.clear)
                        Spacer()
                        Button(intent: TrackIntent(intent: .nextDrink)) {
                            Image(systemName: "chevron.right.circle.fill")
                                .foregroundStyle(gradient)
                        }.tint(.clear)
                    }.offset(y: -20)
                    VStack {
                        Spacer()
                        Button(intent: intent) {
                            Text(isPremiumDrink ? "Locked" : drink.buttonTitle)
                                .font(.system(size: 12, weight: .medium))
                                .padding(6).padding(.horizontal, 8)
                                .background(
                                    Color.accentColor.cornerRadius(15.0).opacity(isPremiumDrink ? 0.2 : 0.8)
                                ).foregroundColor(.white)
                        }.tint(.clear).offset(y: 7).transition(.identity)
                    }
                }
            }
            VStack {
                HStack {
                    Image(systemName: "drop.fill").foregroundStyle(gradient)
                    Spacer()
                }.foregroundColor(.accentColor)
                Spacer()
            }.offset(x: -5, y: -5)
        }
    }

    /// Gradient layer
    private var gradient: LinearGradient {
        LinearGradient(colors: [.accentColor.opacity(0.5), .accentColor], startPoint: .top, endPoint: .bottom)
    }

    /// Check if current drink is premium
    private var isPremiumDrink: Bool {
        !manager.isPremiumUser
        && !AppConfig.freeDrinks.contains(manager.currentWidgetDrink)
    }

    /// Medium widget intent
    private var intent: TrackIntent {
        isPremiumDrink ? .init(intent: .none)
        : .init(intent: .none, customDrink: drink.rawValue)
    }

    /// Current drink
    private var drink: DrinkType {
        manager.currentWidgetDrink
    }
}

/// Widget configuration
struct WaterTrackerWidget: Widget {
    let kind: String = "WaterTrackerWidget"

    // MARK: - Main rendering function
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            WaterTrackerWidgetEntryView(entry: entry)
                .containerBackground(for: .widget) {
                    Color.secondaryBackground
                }
        }
        .configurationDisplayName("Water Tracker")
        .description("Refresh, Refuel, Repeat!")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// MARK: - Preview UI
#Preview(as: .systemMedium) {
    WaterTrackerWidget()
} timeline: {
    WidgetEntry(date: .now)
}
