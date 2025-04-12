//
//  WaterTrackerWidgetBundle.swift
//  WaterTrackerWidget
//
//  Created by Apps4World on 12/14/23.
//

import SwiftUI
import WidgetKit

@main
struct WaterTrackerWidgetBundle: WidgetBundle {
    var body: some Widget {
        WaterTrackerWidget()
    }
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> WidgetEntry {
        WidgetEntry(date: .now)
    }

    func getSnapshot(in context: Context, completion: @escaping (WidgetEntry) -> ()) {
        completion(WidgetEntry(date: .now))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<WidgetEntry>) -> ()) {
        let timeline = Timeline(entries: [WidgetEntry(date: .now)], policy: .atEnd)
        completion(timeline)
    }
}

struct WidgetEntry: TimelineEntry {
    let date: Date
}
